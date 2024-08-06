"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Post, PostStatusEnum, Like, TokenBlockedList, seed
from api.utils import generate_sitemap, APIException
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, timezone

import smtplib
import ssl
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders


smtp_address = os.getenv("SMTP_ADDRESS")
smtp_port = os.getenv("EMAIL_PORT")
email_address = os.getenv("EMAIL_ADDRESS")
email_password = os.getenv("EMAIL_PASSWORD")


api = Blueprint('api', __name__)
app = Flask(__name__)
bcrypt = Bcrypt(app)


def send_email(asunto, destinatario, body):
    message = MIMEMultipart("alternative")
    message["Subject"] = asunto
    message["From"] = email_address
    message["To"] = destinatario

    # Version HTML del body
    html = '''  
    <html>
    <body>
    <div>
    <h1></h1>
    ''' + body + '''
    </div>
    </body>
    </html> 
    '''

    # Crear elemento MIME
    html_mime = MIMEText(html, 'html')
    # adjuntamos el codigo del mensaje
    message.attach(html_mime)

    # Enviar el correo
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_address, smtp_port, context=context) as server:
            server.login(email_address, email_password)
            server.sendmail(email_address, destinatario, message.as_string())
        return True
    except Exception as error:
        print(str(error))
        return False


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/user', methods=['POST'])
def create_user():
    try:
        # Obtén los datos del cuerpo de la solicitud
        first_name = request.json.get("firstName")
        last_name = request.json.get("lastName")
        user_name = request.json.get("user_name")
        email = request.json.get("email")
        password = request.json.get("password")
        img = request.json.get("img")

        # Asegúrate de que todos los campos requeridos estén presentes
        if not all([first_name, last_name, user_name, email, password]):
            return jsonify({"error": "Faltan campos obligatorios"}), 400

        # Hashear la contraseña
        secure_password = bcrypt.generate_password_hash(password, 10).decode("utf-8")

        # Crear un nuevo usuario
        new_user = User(
            firstName=first_name,
            lastName=last_name,
            user_name=user_name,
            email=email,
            password=secure_password,
            img=img
        )

        # Añadir y confirmar los cambios en la base de datos
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "Usuario registrado"}), 201
    except Exception as e:
        # Captura cualquier error y devuelve un mensaje de error
        return jsonify({"error": str(e)}), 500


@api.route('/user', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        return jsonify(users=[user.serialize() for user in users]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/user/<int:user_id>', methods=['GET'])
def get_user_id(user_id):
    try:
        user = User.query.get(user_id)

        if user is not None:
            return jsonify(user=user.serialize()), 200

        return jsonify({"msg": "El usuario no existe"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@api.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if user is not None:
            db.session.delete(user)
            db.session.commit()
            return jsonify({"msg": "Usuario eliminado"}), 204
        return jsonify({"msg": "El usuario no existe"}), 404

    except Exception as e:
        return jsonify({"error": "Ocurrió un error al eliminar el usuario"}), 500


@api.route('/user/<int:user_id>', methods=['PATCH'])
def patch_user_id(user_id):
    try:
        user = User.query.get(user_id)

        if user is None:
            return jsonify({"msg": "El usuario no existe"}), 404

        fields_to_update = request.json

        for field, value in fields_to_update.items():
            if hasattr(user, field):
                setattr(user, field, value)
            else:
                return jsonify({"msg": f"El campo '{field}' no es válido"}), 400

        db.session.commit()
        return jsonify({"msg": "El usuario ha sido actualizado"}), 200

    except Exception as e:
        return jsonify({"error": "Ocurrió un error al actualizar el usuario"}), 500



from flask_jwt_extended import create_access_token

@api.route('/login', methods=['POST'])
def login():
    # Obtenemos los campos del cuerpo de la petición
    email = request.json.get("email")
    password = request.json.get("password")

    # Busca al usuario en la tabla de usuarios
    user = User.query.filter_by(email=email).first()

    if user:
        # Verifica la contraseña para usuarios
        if bcrypt.check_password_hash(user.password, password):
            identity = user.id
            user_data = {
                "id": user.id,
                "firstName": user.firstName,
                "lastName": user.lastName,
                "user_name": user.user_name,
                "email": user.email,
                "img": user.img,
            }
            
            # Genera el token 
            token = create_access_token(identity=identity)

            return jsonify({"message": "Login successful", "token": token, "user": user_data}), 200
        else:
            return jsonify({"message": "Wrong password"}), 401
    else:
        return jsonify({"message": "User not found"}), 404


from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

@api.route('/private')
@jwt_required()  # Este decorador convierte la ruta en protegida
def private():
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        user = User.query.get(user_id)

        if user is None:
            return jsonify({"message": "User not found"}), 404

        response = {
            "userId": user_id,
            "claims": claims,
            # "isActive": user.is_active  # Añadir este campo si es relevante
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/logout', methods=['POST'])
@jwt_required()
def user_logout():
    try:
        # Obtener el JTI (JWT ID) del token actual
        jti = get_jwt()["jti"]
        now = datetime.now(timezone.utc)

        # Crea una entrada en la lista de tokens bloqueados
        token_blocked = TokenBlockedList(token=jti, created_at=now)
        db.session.add(token_blocked)
        db.session.commit()

        return jsonify({"message": "User logged out"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@api.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    try:
        # Obtén el ID del usuario autenticado
        user_id = get_jwt_identity()

        # Obtén los datos del cuerpo de la solicitud
        image = request.json.get("image")
        message = request.json.get("message")
        created_at = request.json.get("created_at")
        location = request.json.get("location")
        status = request.json.get("status")

        # Asegúrate de que todos los campos requeridos estén presentes
        if not all([message, created_at, status]):
            return jsonify({"error": "Faltan campos obligatorios"}), 400

        # Validar el formato de `created_at` y convertirlo a `datetime.date`
        try:
            created_at_date = datetime.strptime(created_at, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Formato de fecha inválido. Use YYYY-MM-DD."}), 400

        # Validar el valor del `status`
        try:
            status_enum = PostStatusEnum[status]
        except KeyError:
            return jsonify({"error": "Estado inválido para la publicación."}), 400

        # Crear un nuevo post
        new_post = Post(
            image=image,
            message=message,
            author=user_id,  # Utiliza el ID del usuario autenticado como autor
            created_at=created_at_date,
            location=location,
            status=status_enum
        )

        # Añadir y confirmar los cambios en la base de datos
        db.session.add(new_post)
        db.session.commit()

        return jsonify(new_post.serialize()), 201
    except Exception as e:
        # Captura cualquier error y devuelve un mensaje de error
        return jsonify({"error": str(e)}), 500

@api.route('/posts', methods=['GET'])
def get_all_posts():
    try:
        posts = Post.query.all()
        return jsonify(posts=[post.serialize() for post in posts]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/user/<int:user_id>/posts', methods=['GET'])
def get_posts_by_user(user_id):
    try:
        # Obtener todos los posts del usuario con el ID proporcionado
        posts = Post.query.filter_by(author=user_id).all()

        if posts:
            return jsonify(posts=[post.serialize() for post in posts]), 200
        else:
            return jsonify({"msg": "No se encontraron publicaciones para este usuario"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/posts/<int:post_id>/like', methods=['POST'])
@jwt_required()
def like_post(post_id):
    try:
        user_id = get_jwt_identity()

        # Verificar si el usuario ya ha dado like al post
        existing_like = Like.query.filter_by(user_like=user_id, post_like=post_id).first()
        if existing_like:
            return jsonify({"error": "Ya has dado like a este post."}), 400

        # Crear un nuevo like
        new_like = Like(user_like=user_id, post_like=post_id)
        db.session.add(new_like)
        db.session.commit()

        return jsonify(new_like.serialize()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/likes', methods=['GET'])
def get_all_likes():
    try:
        likes = Like.query.all()
        return jsonify(likes=[like.serialize() for like in likes]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/posts/<int:post_id>/likes', methods=['GET'])
def get_likes_by_post(post_id):
    try:
        # todos los likes para el post especificado
        likes = Like.query.filter_by(post_like=post_id).all()
        
        if not likes:
            return jsonify({"msg": "No hay likes para este post."}), 404

        # recuento total de likes
        like_count = len(likes)

        #  último like (si existe)
        last_like = likes[-1] if likes else None
        last_like_user_name = None
        if last_like:
            last_like_user = User.query.get(last_like.user_like)
            last_like_user_name = last_like_user.user_name if last_like_user else None

        # respuesta
        response = {
            "like_count": like_count,
            "last_like_user_name": last_like_user_name,
            "likes": [like.serialize() for like in likes]
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@api.route('/check-token', methods=['POST'])
@jwt_required()
def check_token():
    jti = get_jwt()["jti"]
    # Verificar si el jti está en la tabla TokenBlockList
    blocked_token = TokenBlockedList.query.filter_by(token=jti).first()

    if blocked_token:
        return jsonify({"Success": True, "msg": "Token bloqueado"}), 200
    else:
        return jsonify({"Success": False, "msg": "Token no bloqueado"}), 200


@api.route('/seed', methods=['POST', 'GET'])
def handle():
    seed()
    response_body = {
        "message": "Data cargada"
    }

    return jsonify(response_body), 200


@api.route('/requestpassword', methods=["POST"])
def endpoint_mail():
    body = request.get_json()
    email = body["email"]
    user = User.query.filter_by(email=email).first()
    if user is None:
        
        
        print(jsonify({"message": "El usuario no existe"}))

    token = create_access_token(identity=email, additional_claims={
                                "type": "password", "email": email})

    cuerpo = os.getenv("FRONTEND_URL") + '/changepassword?token=' + token
    verificar = send_email("Recuperacion de Clave", email, cuerpo)

    if verificar == True:
        return jsonify({"message": "Gmail Enviado"}), 200
    else:
        return jsonify({"message": "No se pudo enviar el correo"}), 400


@api.route('/changepassword', methods=['PATCH'])
def change_password():
    try:
        body = request.get_json()
        email = body["email"]
        user = User.query.filter_by(email=email).first()
        if user is None:
            
            return jsonify({"message": "El usuario no existe"}), 404

        new_password = request.json.get("password")
        if new_password:
            hashed_password = bcrypt.generate_password_hash(
                new_password, 10).decode("utf-8")

            if user:
                user.password = hashed_password
            

            db.session.commit()

            return jsonify({"message": "Contraseña cambiada exitosamente"}), 200
        else:
            return jsonify({"message": "La nueva contraseña no se proporcionó"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/decrypt', methods=['POST'])
@jwt_required()
def decrypt():
    try:
        email = get_jwt().get('email', None)

        return jsonify({"email": email}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

