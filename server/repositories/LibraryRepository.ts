import { BaseRepository } from './BaseRepository.js';
import {
  LibraryCategory,
  LibrarySubcategory,
  Author,
  Publisher,
  LibraryBook,
  Shelf,
  BookCopy,
  LibraryMember,
  LibraryCard,
  BookIssue,
  BookReturn,
  BookReservation,
  FineRecord,
  RFIDTag,
  QRCodeRegistry,
  DigitalResource,
  Ebook,
  ResearchPaper,
  Journal,
  PreviousYearPaper,
  QuestionBank,
  StudyMaterial,
  BookReview,
  ReadingHistory,
  AIBookRecommendation,
  KnowledgeCollection,
  ResourceDownloadLog
} from '../entities/LibraryDomain.js';

export class LibraryCategoryRepository extends BaseRepository<LibraryCategory> {
  protected tableName = 'library_category';
}

export class LibrarySubcategoryRepository extends BaseRepository<LibrarySubcategory> {
  protected tableName = 'library_subcategory';
}

export class AuthorRepository extends BaseRepository<Author> {
  protected tableName = 'author_master';
}

export class PublisherRepository extends BaseRepository<Publisher> {
  protected tableName = 'publisher_master';
}

export class LibraryBookRepository extends BaseRepository<LibraryBook> {
  protected tableName = 'library_book';
}

export class ShelfRepository extends BaseRepository<Shelf> {
  protected tableName = 'shelf_master';
}

export class BookCopyRepository extends BaseRepository<BookCopy> {
  protected tableName = 'library_copy';
}

export class LibraryMemberRepository extends BaseRepository<LibraryMember> {
  protected tableName = 'library_member';
}

export class LibraryCardRepository extends BaseRepository<LibraryCard> {
  protected tableName = 'library_card';
}

export class BookIssueRepository extends BaseRepository<BookIssue> {
  protected tableName = 'library_issue';
}

export class BookReturnRepository extends BaseRepository<BookReturn> {
  protected tableName = 'library_return';
}

export class BookReservationRepository extends BaseRepository<BookReservation> {
  protected tableName = 'library_reservation';
}

export class FineRecordRepository extends BaseRepository<FineRecord> {
  protected tableName = 'fine_master';
}

export class RFIDTagRepository extends BaseRepository<RFIDTag> {
  protected tableName = 'rfid_registry';
}

export class QRCodeRegistryRepository extends BaseRepository<QRCodeRegistry> {
  protected tableName = 'qr_registry';
}

export class DigitalResourceRepository extends BaseRepository<DigitalResource> {
  protected tableName = 'digital_resource';
}

export class EbookRepository extends BaseRepository<Ebook> {
  protected tableName = 'ebook_repository';
}

export class ResearchPaperRepository extends BaseRepository<ResearchPaper> {
  protected tableName = 'research_repository';
}

export class JournalRepository extends BaseRepository<Journal> {
  protected tableName = 'journal_repository';
}

export class PreviousYearPaperRepository extends BaseRepository<PreviousYearPaper> {
  protected tableName = 'previous_year_paper';
}

export class LibraryQuestionBankRepository extends BaseRepository<QuestionBank> {
  protected tableName = 'question_bank';
}

export class StudyMaterialRepository extends BaseRepository<StudyMaterial> {
  protected tableName = 'study_material';
}

export class BookReviewRepository extends BaseRepository<BookReview> {
  protected tableName = 'book_review';
}

export class ReadingHistoryRepository extends BaseRepository<ReadingHistory> {
  protected tableName = 'reading_history';
}

export class AIBookRecommendationRepository extends BaseRepository<AIBookRecommendation> {
  protected tableName = 'ai_book_recommendation';
}

export class KnowledgeCollectionRepository extends BaseRepository<KnowledgeCollection> {
  protected tableName = 'knowledge_collection';
}

export class ResourceDownloadLogRepository extends BaseRepository<ResourceDownloadLog> {
  protected tableName = 'resource_download_log';
}
