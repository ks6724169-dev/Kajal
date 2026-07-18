import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  LibraryBookRepository,
  BookCopyRepository,
  BookIssueRepository,
  BookReturnRepository,
  BookReservationRepository,
  FineRecordRepository
} from '../repositories/LibraryRepository.js';
import { notificationEngine } from './NotificationEngine.js';

export class LibraryService {
  
  public async registerBook(tenantId: string, bookData: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(LibraryBookRepository);
      const book = await repo.insert({
        ...bookData,
        status: 'ACTIVE'
      });
      await uow.commit();
      return book;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async issueBook(tenantId: string, memberId: string, copyId: string, dueDate: Date): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      
      const copyRepo = uow.getRepository(BookCopyRepository);
      const copy = await copyRepo.findOne(copyId);
      if (!copy || !copy.isAvailable) {
        throw new Error('Book copy is not available for issue');
      }

      await copyRepo.update(copyId, { isAvailable: false }, copy.version);

      const issueRepo = uow.getRepository(BookIssueRepository);
      const issue = await issueRepo.insert({
        memberId,
        copyId,
        dueDate,
        isReturned: false,
        status: 'ACTIVE'
      });
      
      // Notify member
      // Assumes we have user ID mapped, for demo we just use memberId assuming it links to user
      await notificationEngine.sendInAppNotification(tenantId, memberId, 'Book Issued', 'A book has been issued to you.');

      await uow.commit();
      return issue;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async returnBook(tenantId: string, issueId: string, conditionOnReturn?: string, fineAmount?: number): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      
      const issueRepo = uow.getRepository(BookIssueRepository);
      const issue = await issueRepo.findOne(issueId);
      if (!issue || issue.isReturned) {
        throw new Error('Invalid or already returned issue record');
      }

      await issueRepo.update(issueId, { isReturned: true, returnDate: new Date() }, issue.version);

      const copyRepo = uow.getRepository(BookCopyRepository);
      const copy = await copyRepo.findOne(issue.copyId);
      if (copy) {
         await copyRepo.update(issue.copyId, { isAvailable: true, condition: conditionOnReturn || copy.condition }, copy.version);
      }

      const returnRepo = uow.getRepository(BookReturnRepository);
      const returnRecord = await returnRepo.insert({
        issueId,
        conditionOnReturn,
        fineAmount: fineAmount || 0,
        status: 'ACTIVE'
      });

      if (fineAmount && fineAmount > 0) {
         const fineRepo = uow.getRepository(FineRecordRepository);
         await fineRepo.insert({
            memberId: issue.memberId,
            issueId,
            amount: fineAmount,
            reason: 'Late return or damaged',
            isPaid: false,
            status: 'ACTIVE'
         });
         await notificationEngine.sendInAppNotification(tenantId, issue.memberId, 'Fine Generated', `A fine of ${fineAmount} has been added.`);
      } else {
         await notificationEngine.sendInAppNotification(tenantId, issue.memberId, 'Book Returned', 'Thank you for returning the book.');
      }

      await uow.commit();
      return returnRecord;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async reserveBook(tenantId: string, memberId: string, bookId: string, expiryDate?: Date): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(BookReservationRepository);
      const reservation = await repo.insert({
        memberId,
        bookId,
        expiryDate,
        isFulfilled: false,
        status: 'ACTIVE'
      });
      await uow.commit();
      return reservation;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

}

export const libraryService = new LibraryService();
