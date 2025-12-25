from flask import Flask, render_template, request, jsonify, session
import joblib
import os
import numpy as np

app = Flask(__name__)
app.secret_key = "ai_cyber_escape_room_secret"

# ---------------- PATH SETUP ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "..", "MODELS")

# ---------------- LOAD MODELS ----------------
phishing_url_model = joblib.load(os.path.join(MODEL_DIR, "phishing_url_model.pkl"))
url_vectorizer = joblib.load(os.path.join(MODEL_DIR, "url_vectorizer.pkl"))

phishing_website_model = joblib.load(os.path.join(MODEL_DIR, "phishing_website_model.pkl"))

password_model = joblib.load(os.path.join(MODEL_DIR, "password_strength_model.pkl"))
password_vectorizer = joblib.load(os.path.join(MODEL_DIR, "password_vectorizer.pkl"))

# ---------------- ROUTES ----------------

# Home page (username input)
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        session["username"] = request.form["username"]
        return render_template(
            "level1_phishing.html",
            username=session["username"]
        )
    return render_template("index.html")

@app.route("/level1")
def level1():
    return render_template(
        "level1_phishing.html",
        username=session.get("username")
    )

@app.route("/level2")
def level2():
    return render_template(
        "level2_website.html",
        username=session.get("username")
    )

@app.route("/level3")
def level3():
    return render_template(
        "level3_password.html",
        username=session.get("username")
    )

@app.route("/success")
def success():
    return render_template(
        "success.html",
        username=session.get("username")
    )

# ---------------- AI ROUTES ----------------

# Level 1: Phishing URL Detection
@app.route("/check_url", methods=["POST"])
def check_url():
    url = request.json["url"]
    features = url_vectorizer.transform([url])
    prediction = phishing_url_model.predict(features)[0]
    return jsonify({"result": int(prediction)})

# Level 2: Phishing Website Feature Detection
@app.route("/check_website", methods=["POST"])
def check_website():
    features = np.array(request.json["features"]).reshape(1, -1)
    prediction = phishing_website_model.predict(features)[0]
    return jsonify({"result": int(prediction)})

# Level 3: Password Strength Detection
@app.route("/check_password", methods=["POST"])
def check_password():
    password = request.json["password"]
    features = password_vectorizer.transform([password])
    strength = password_model.predict(features)[0]
    return jsonify({"strength": int(strength)})

# ---------------- RUN APP ----------------
if __name__ == "__main__":
    app.run(debug=True)
