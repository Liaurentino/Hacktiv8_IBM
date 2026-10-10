import { isPostgres, pgPool, sqliteDb, calculateGrade } from './config/db.js';
import UserModel from './models/userModel.js';
import StudentModel from './models/studentModel.js';
import FlagModel from './models/flagModel.js';
import ChatModel from './models/chatModel.js';

export {
  isPostgres,
  pgPool,
  sqliteDb,
  calculateGrade,
  UserModel as userRepository,
  StudentModel as studentRepository,
  FlagModel as flagRepository,
  ChatModel as chatRepository
};

export default {
  isPostgres,
  pgPool,
  sqliteDb,
  calculateGrade,
  userRepository: UserModel,
  studentRepository: StudentModel,
  flagRepository: FlagModel,
  chatRepository: ChatModel
};
