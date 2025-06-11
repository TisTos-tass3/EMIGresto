import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

# Exemple d'entraînement d'un modèle de prédiction
class ReservationPredictor:
    def __init__(self):
        self.model = LinearRegression()

    def train(self, data):
        df = pd.DataFrame(data)
        X = df[["jour_semaine", "periode_id", "total_etudiants"]]
        y = df["reservations"]
        self.model.fit(X, y)

    def predict(self, jour_semaine, periode_id, total_etudiants):
        X = np.array([[jour_semaine, periode_id, total_etudiants]])
        return round(self.model.predict(X)[0])
 