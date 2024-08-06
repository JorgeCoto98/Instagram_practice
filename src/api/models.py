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






def seed():
    seeder = ResolvingSeeder(db.session)
    seeder.register(User)
    seeder.register(Post)
    seeder.register(Like)
    seeder.load_entities_from_json_file("seedData.json")
    db.session.commit()