import { Op } from "sequelize";
import Document from "../db/models/document.model";
import DocumentUser from "../db/models/document-user.model";

export default class DocumentService {
  static findDocumentById = async (id: number, userId: number) => {
    const document = await Document.findOne({
      where: {
        [Op.or]: [
          {
            id,
            userId,
          },
          {
            id,
            isPublic: true,
          },
        ],
      },
    });
    if (!document) {
      const sharedDocument = await DocumentUser.findOne({
        where: { userId: userId, documentId: id },
        include: { model: Document },
      });
      if (!sharedDocument) return null;

      return sharedDocument.document;
    }
  };
}
