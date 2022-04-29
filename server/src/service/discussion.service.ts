import { HydratedDocument, Types } from 'mongoose';
import DiscussionModel, { Discussion } from '../models/discussion.model';
import { DiscussionDto } from '../dtos/discussion.dto';
import ApiError from '../exceptions/api.error';

class DiscussionService {
  verifyCreator(userId: string, creatorId: string): boolean {
    return userId === creatorId;
  }

  async getDiscussion(discussionId: string, userId?: string) {
    const isValidDiscussionId = Types.ObjectId.isValid(discussionId);
    if (!isValidDiscussionId)
      throw ApiError.BadRequestError('Неверное значение идентификатора обсуждения!');
    const discussion: HydratedDocument<Discussion> | null = await DiscussionModel.findById(
      discussionId,
    );
    if (!discussion) throw ApiError.BadRequestError('Обсуждение не найдено!');
    const discussionDto = new DiscussionDto(discussion);
    if (userId) {
      const creatorId: string = discussion.creatorId.toString();
      return {
        ...discussionDto,
        isCreator: userId === creatorId, // authorship verification
      };
    }
    return discussionDto;
  }

  async getAllDiscussions(limit: number | undefined, title: string) {
    const filter = title.length ? { title: { $regex: title, $options: 'i' } } : {};
    const discussions = await DiscussionModel.find(filter, null, {
      sort: { creationDate: -1 },
      limit,
    });
    const discussionsDto: DiscussionDto[] = discussions.map(
      (discussion) => new DiscussionDto(discussion),
    );
    return discussionsDto;
  }

  async createDiscussion(userId: string, discussionTitle: string, discussionBody: string) {
    const discussion: HydratedDocument<Discussion> = await DiscussionModel.create({
      title: discussionTitle,
      creationDate: new Date(),
      body: discussionBody,
      creatorId: userId,
    });
    const discussionDto = new DiscussionDto(discussion);
    return discussionDto;
  }

  async deleteDiscussion(discussionId: string, userId: string) {
    const isCreator: boolean = this.verifyCreator(userId, discussionId);
    if (!isCreator) {
      throw ApiError.BadRequestError('you can not delete someone else`s discussion!');
    }
    const discussion: HydratedDocument<Discussion> | null = await DiscussionModel.findByIdAndDelete(
      discussionId,
    );
    if (!discussion) throw ApiError.BadRequestError('nothing to delete!');
    return discussion;
  }

  async updateDiscussion(
    discussionId: Types.ObjectId,
    discussionTitle: string,
    discussionBody: string,
  ) {
    const discussion: HydratedDocument<Discussion> | null = await DiscussionModel.findById(
      discussionId,
    );
    if (!discussion) throw new Error('Editable discussion not found!');
    discussion.title = discussionTitle;
    discussion.body = discussionBody;
    await discussion.save();
    return discussion;
  }

  async addView(discussionId: string) {
    if (!discussionId) throw ApiError.BadRequestError('discussion id missing!');
    const discussion: HydratedDocument<Discussion> | null = await DiscussionModel.findById(
      discussionId,
    );
    if (!discussion) throw ApiError.BadRequestError('discussion not found!');
    discussion.viewsCount++;
    await discussion.save();
    return discussion;
  }
}

export default new DiscussionService();
