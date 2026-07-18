import { BaseEntity } from './BaseEntity.js';

export interface LibraryCategory extends BaseEntity {
  name: string;
  description?: string;
}

export interface LibrarySubcategory extends BaseEntity {
  categoryId: string;
  name: string;
  description?: string;
}

export interface Author extends BaseEntity {
  name: string;
  bio?: string;
}

export interface Publisher extends BaseEntity {
  name: string;
  address?: string;
  contactDetails?: any;
}

export interface LibraryBook extends BaseEntity {
  title: string;
  isbn?: string;
  categoryId?: string;
  subcategoryId?: string;
  authorId?: string;
  publisherId?: string;
  edition?: string;
  language?: string;
  pages?: number;
  price?: number;
  description?: string;
  coverImageUrl?: string;
  searchVector?: any;
}

export interface Shelf extends BaseEntity {
  shelfNumber: string;
  location?: string;
  capacity?: number;
}

export interface BookCopy extends BaseEntity {
  bookId: string;
  barcode?: string;
  shelfId?: string;
  condition?: string;
  isAvailable?: boolean;
}

export interface LibraryMember extends BaseEntity {
  userId: string;
  memberType: string;
  maxBooksAllowed?: number;
  joinDate?: Date;
}

export interface LibraryCard extends BaseEntity {
  memberId: string;
  cardNumber: string;
  issueDate?: Date;
  expiryDate?: Date;
}

export interface BookIssue extends BaseEntity {
  memberId: string;
  copyId: string;
  issueDate?: Date;
  dueDate: Date;
  returnDate?: Date;
  isReturned?: boolean;
}

export interface BookReturn extends BaseEntity {
  issueId: string;
  returnDate?: Date;
  conditionOnReturn?: string;
  fineAmount?: number;
}

export interface BookReservation extends BaseEntity {
  memberId: string;
  bookId: string;
  reservationDate?: Date;
  expiryDate?: Date;
  isFulfilled?: boolean;
}

export interface FineRecord extends BaseEntity {
  memberId: string;
  issueId?: string;
  amount: number;
  reason?: string;
  isPaid?: boolean;
  paidDate?: Date;
}

export interface RFIDTag extends BaseEntity {
  copyId?: string;
  rfidTag: string;
  assignedDate?: Date;
}

export interface QRCodeRegistry extends BaseEntity {
  entityType: string;
  entityId: string;
  qrCodeData: string;
}

export interface DigitalResource extends BaseEntity {
  title: string;
  description?: string;
  resourceType: string;
  categoryId?: string;
  authorId?: string;
  fileUrl: string;
  fileSize?: number;
  searchVector?: any;
  publishedDate?: Date;
}

export interface Ebook extends BaseEntity {
  resourceId: string;
  isbn?: string;
  format?: string;
}

export interface ResearchPaper extends BaseEntity {
  resourceId: string;
  doi?: string;
  abstract?: string;
  keywords?: any;
}

export interface Journal extends BaseEntity {
  resourceId: string;
  volume?: string;
  issue?: string;
  issn?: string;
}

export interface PreviousYearPaper extends BaseEntity {
  resourceId: string;
  examination?: string;
  subject?: string;
  year?: number;
}

export interface QuestionBank extends BaseEntity {
  resourceId: string;
  subject?: string;
  topic?: string;
  difficultyLevel?: string;
}

export interface StudyMaterial extends BaseEntity {
  resourceId: string;
  className?: string;
  subject?: string;
}

export interface BookReview extends BaseEntity {
  bookId: string;
  memberId: string;
  rating?: number;
  reviewText?: string;
}

export interface ReadingHistory extends BaseEntity {
  memberId: string;
  bookId?: string;
  resourceId?: string;
  readDate?: Date;
  timeSpentMinutes?: number;
}

export interface AIBookRecommendation extends BaseEntity {
  memberId: string;
  recommendedBooks: any;
  recommendedResources?: any;
  reasoning?: string;
}

export interface KnowledgeCollection extends BaseEntity {
  name: string;
  description?: string;
  curatorId?: string;
  resources?: any;
}

export interface ResourceDownloadLog extends BaseEntity {
  resourceId: string;
  memberId: string;
  downloadDate?: Date;
}
