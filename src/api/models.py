from flask_sqlalchemy import SQLAlchemy
from sqlalchemyseeder import ResolvingSeeder
import enum

db = SQLAlchemy()



class PostStatusEnum(enum.Enum):
    DRAFTED = "drafted"
    DELETED = "deleted"
    PUBLISHED = "published"


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(20), nullable=False)
    lastName = db.Column(db.String(20), nullable=False)
    user_name = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    img = db.Column(db.String(400), nullable=True)
    posts = db.relationship('Post', backref='author_ref', lazy=True)
    likes = db.relationship('Like', backref='user_ref', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "user_name": self.user_name,
            "img": self.img,
            # No serializar la contraseña, es un problema de seguridad
        }


class TokenBlockedList(db.Model):
    __tablename__ = 'token_blocked_list'
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(1000), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)


class Post(db.Model):
    __tablename__ = 'posts'
    id_post = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    image = db.Column(db.String, nullable=True)
    message = db.Column(db.String(500), nullable=False)
    author = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.Date, nullable=False)
    location = db.Column(db.String(30), nullable=True)
    status = db.Column(db.Enum(PostStatusEnum, name="post_status_enum"), nullable=False)
    likes = db.relationship('Like', backref='post_ref', lazy=True)

    def __repr__(self):
        return f'<Post {self.id_post}>'

    def serialize(self):
        return {
            "id_post": self.id_post,
            "image": self.image,
            "message": self.message,
            "author": self.author,
            "created_at": self.created_at,
            "location": self.location,
            "status": self.status.value  # Convert Enum to string for serialization
        }


class Like(db.Model):
    __tablename__ = 'likes'
    id_like = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    user_like = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_like = db.Column(db.Integer, db.ForeignKey('posts.id_post'), nullable=False)

    def __repr__(self):
        return f'<Like {self.id_like}>'

    def serialize(self):
        return {
            "id_like": self.id_like,
            "user_like": self.user_like,
            "post_like": self.post_like
        }






# class User(db.Model):
#     __tablename__ = 'user'
#     id = db.Column(db.Integer, primary_key=True)
#     firstName = db.Column(db.String(40), nullable=False)
#     lastName = db.Column(db.String(40), nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     password = db.Column(db.String(400), unique=False, nullable=False)
#     img = db.Column(db.String(400), nullable=False)
#     role = db.Column(db.String(150), nullable=False)
#     teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.id'))
#     teacher = db.relationship('Teacher', back_populates='students')
#     answersuser = db.relationship('AnswersUser', back_populates='user' ) 
      

#     # module_progress = db.relationship('ModuleProgress', backref='user', lazy=True)

#     def __repr__(self):
#         return f'<User {self.email}>'
    
    
#     def serialize(self):
        
#         return {
#             "id": self.id,
#             "email": self.email,
#             "firstName": self.firstName,
#             "lastName": self.lastName,
#             "img": self.img,
#             "role": self.role,
#             "teacher": self.teacher_id,

            
#             # "No" serializar la contraseña, es un problema de seguridad
#         }



# #crear la class Studen y a la clase Teacher
# # class Teacher(db.Model):
# #     __tablename__ = 'teacher'
# #     id = db.Column(db.Integer, primary_key=True)
# #     students = db.relationship('User', back_populates='teacher')
    

# class Teacher(db.Model):
#     __tablename__ = 'teacher'
#     id = db.Column(db.Integer, primary_key=True)
#     firstName = db.Column(db.String(40), nullable=False)
#     lastName = db.Column(db.String(40), nullable=False)
#     email = db.Column(db.String(250), nullable=False)
#     password = db.Column(db.String(250), nullable=False)
#     role= db.Column(db.String(250), nullable=False)
#     students = db.relationship('User', back_populates='teacher')
    

#     def __repr__(self):
#         return f'{self.firstName} {self.lastName}'

#     def serialize(self):
#         students = list(map  (lambda a:  a.serialize(), self.students))
#         return {
#             "id": self.id,
#             "firstName": self.firstName,
#             "lastName": self.lastName,
#             "role": self.role,
#             "students": students
            
#         }

#     def list_teachers(self):
#         return {
#             "id": self.id,
#             "firstName": self.firstName,
#             "lastName": self.lastName,
#             "role": self.role,
            
#         }

#     def student_teacher(self):
#         return self.firstName + " " + self.lastName


# class TokenBlockedList(db.Model):
#     id=db.Column(db.Integer, primary_key=True)
#     token=db.Column(db.String(1000), unique=True, nullable=False)
#     created_at=db.Column(db.DateTime, nullable=False)


# class Exercise(db.Model):
#     __tablename__ = 'exercise'
#     id = db.Column(db.Integer, primary_key=True)
#     module = db.Column(db.String(50))
#     type = db.Column(db.String(40))
#     question = db.Column(db.String(250))
#     info_blog = db.Column(db.String(250))
#     info_youtube = db.Column(db.String(250))
#     answers = db.relationship('Answers', back_populates='exercise' )
#     answersuser = db.relationship('AnswersUser', back_populates='exercise' )

#     def __repr__(self):
#         return f'<Exercise {self.question}>'

#     def serialize(self):
#         answers = list(map(lambda a: a.serialize(), self.answers))
#         if self.type == "SC":
#             return {
#                 "id": self.id,
#                 "module": self.module,
#                 "type": self.type,
#                 "question": self.question,
#                 "info_blog": self.info_blog,
#                 "info_youtube":self.info_youtube,
#                 "answers": answers

#             }
#         else :
#             return {
#                 "id": self.id,
#                 "module": self.module,
#                 "type": self.type,
#                 "question": self.question,
#                 "info_blog": self.info_blog,
#                 "info_youtube":self.info_youtube,
#             }

# class Answers(db.Model):
#     __tablename__ = 'answers'
#     id = db.Column(db.Integer, primary_key=True)
#     module = db.Column(db.String(50))
#     type = db.Column(db.String(40))
#     answers = db.Column(db.String(250))
#     exercise_id = db.Column(db.Integer, db.ForeignKey('exercise.id'))
#     exercise = db.relationship(Exercise, back_populates='answers')
#     isCorrect = db.Column(db.Boolean, default=False)
    
#     def __repr__(self):
#         return f'<ExerciseAnswer {self.id}>'


#     def serialize(self):
#         #self.exercise.serialize()
#         return {
#             "id": self.id,
#             "answers": self.answers,
#             # "isCorrect": self.isCorrect,
#             # "type": self.type,
#             "exercise_id": self.exercise_id,
#             # "module" : self.exercise.module,
#             # "type" : self.exercise.type
#         }
    
# class AnswersUser(db.Model):
#     __tablename__ = 'answersuser'
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
#     module = db.Column(db.String(50))
#     type = db.Column(db.String(40))
#     user = db.relationship(User, back_populates='answersuser')
#     exercise_id = db.Column(db.Integer, db.ForeignKey('exercise.id'))
#     exercise = db.relationship(Exercise, back_populates='answersuser')
    
#     def __repr__(self):
#         return f'<AnswerUser {self.id}>'

#     def serialize(self):
#         #self.exercise.serialize()
#         return {
#             "id": self.id,
#             "user_id" : self.user_id,
#             "exercise_id" : self.exercise_id,
#             "module" : self.exercise.module,
#             "type" : self.exercise.type
#         }
    
def seed():
    seeder = ResolvingSeeder(db.session)
    # seeder.register(Exercise)
    # seeder.register(Answers)
    # seeder.register(AnswersUser)
    seeder.register(User)
    seeder.register(Post)
    seeder.register(Like)
    # seeder.register(Teacher)
    seeder.load_entities_from_json_file("seedData.json")
    db.session.commit()


# # class Module(db.Model):
# #     __tablename__ = 'module'
# #     id = db.Column(db.Integer, primary_key=True)
# #     name = db.Column(db.String(100))
# #     description = db.Column(db.String(250))
# #     type = db.Column(db.String(50))

# #     def __repr__(self):
# #         return f'<Module {self.id}>'

# #     def serialize(self):
# #         return {
# #             "id": self.id,
# #             "name": self.name,
# #             "description": self.description,
# #             "type": self.type
# #         }

# #class ModuleProgress(db.Model):
# #    __tablename__ = 'module_progress'
# #      id = db.Column(db.Integer, primary_key=True)
# #     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
# #     module_id = db.Column(db.Integer, db.ForeignKey('module.id'))
# #      progress = db.Column(db.Integer)

# #     def __repr__(self):
# #         return f'<ModuleProgress {self.id}>'

# #     def serialize(self):
# #         return {
# #             "id": self.id,
# #             "user_id": self.user_id,
# #             "module_id": self.module_id,
# #             "progress": self.progress
# #         }