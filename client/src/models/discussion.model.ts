interface DiscussionResponse {
  id: string;
  title: string;
  body: string;
  creationDate: Date;
  viewsCount: number;
  creatorId: string;
  messagesCount: number;
  isCreator: boolean;
}

interface DiscussionRequest {
  title: string;
  body: string;
}

interface DiscussionsListResponse {
  id: string;
  title: string;
  body: string;
}

export type { DiscussionRequest, DiscussionResponse, DiscussionsListResponse };
