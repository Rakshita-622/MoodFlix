"""
MoodFlix — Model Training Script
Builds TF-IDF + cosine similarity matrix from TMDB 5000 dataset.
"""

import os
import ast
import pickle
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics import classification_report, accuracy_score
from sklearn.model_selection import train_test_split
import numpy as np

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
CSV_PATH = os.environ.get("DATA_PATH", os.path.join(DATA_DIR, "tmdb_5000_movies.csv"))
MOVIES_PKL = os.path.join(DATA_DIR, "movies.pkl")
SIMILARITY_PKL = os.path.join(DATA_DIR, "similarity.pkl")


def parse_genres(genres_str: str) -> str:
    """Parse JSON-encoded genres column → space-separated genre names."""
    try:
        genres_list = ast.literal_eval(genres_str)
        return " ".join(g["name"] for g in genres_list)
    except (ValueError, SyntaxError):
        return ""


def train() -> None:
    print("Loading dataset from:", CSV_PATH)
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(
            f"Dataset not found at {CSV_PATH}. "
            "Place tmdb_5000_movies.csv in backend/data/"
        )

    df = pd.read_csv(CSV_PATH)
    print(f"   Loaded {len(df)} movies.")

    # Parse genres
    df["genres_parsed"] = df["genres"].apply(parse_genres)

    # Create content column (overview + genres)
    df["content"] = df["overview"].fillna("") + " " + df["genres_parsed"]

    # Drop rows with empty content
    df = df[df["content"].str.strip().astype(bool)].reset_index(drop=True)
    print(f"   After cleaning: {len(df)} movies with content.")

    # Fit TF-IDF
    print("Fitting TfidfVectorizer...")
    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform(df["content"])

    # Compute cosine similarity
    print("Computing cosine similarity matrix...")
    similarity = cosine_similarity(tfidf_matrix, tfidf_matrix)

    # ---------------------------------------------------------
    # Hit / Flop Classifier (Decision Tree)
    # ---------------------------------------------------------
    print("Training Hit/Flop Decision Tree Classifier...")
    clf_df = df[(df['revenue'] > 0) & (df['runtime'] > 0)].copy()
    median_revenue = clf_df['revenue'].median()
    clf_df['is_hit'] = (clf_df['revenue'] > median_revenue).astype(int)

    mlb = MultiLabelBinarizer()
    genre_matrix = mlb.fit_transform(clf_df['genres_parsed'].apply(lambda x: x.split()))
    
    X = clf_df[['runtime', 'vote_average', 'vote_count']].copy()
    for i, cls in enumerate(mlb.classes_):
        X[cls] = genre_matrix[:, i]
        
    y = clf_df['is_hit'].values
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    dt = DecisionTreeClassifier(max_depth=5, random_state=42)
    dt.fit(X_train, y_train)

    y_pred = dt.predict(X_test)
    print(f"Classification Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("Classification Report:\n", classification_report(y_test, y_pred, target_names=["Flop", "Hit"]))

    # Predict over ALL movies
    df_pred = df.copy()
    df_pred['runtime'] = df_pred['runtime'].replace(0, clf_df['runtime'].median()).fillna(clf_df['runtime'].median())
    df_pred['vote_average'] = df_pred['vote_average'].fillna(clf_df['vote_average'].median())
    df_pred['vote_count'] = df_pred['vote_count'].fillna(clf_df['vote_count'].median())
    
    genre_matrix_all = mlb.transform(df_pred['genres_parsed'].apply(lambda x: x.split()))
    X_all = df_pred[['runtime', 'vote_average', 'vote_count']].copy()
    for i, cls in enumerate(mlb.classes_):
        X_all[cls] = genre_matrix_all[:, i]
        
    y_all_pred = dt.predict(X_all)
    df['hit_flop_label'] = np.where(y_all_pred == 1, "Hit", "Flop")
    print(f"Assigned Hit/Flop Labels manually to all {len(df)} records.\n")

    # Save artifacts
    os.makedirs(DATA_DIR, exist_ok=True)

    with open(MOVIES_PKL, "wb") as f:
        pickle.dump(df, f)

    with open(SIMILARITY_PKL, "wb") as f:
        pickle.dump(similarity, f)

    print(f"SUCCESS: Model trained. movies.pkl and similarity.pkl saved to {DATA_DIR}")

    # --- Print Evaluation Metrics ---
    print("\n--- Model Evaluation Metrics ---")
    
    # 1. Sparsity of TF-IDF matrix
    sparsity = 1.0 - (tfidf_matrix.nnz / (tfidf_matrix.shape[0] * tfidf_matrix.shape[1]))
    print(f"TF-IDF Matrix Sparsity: {sparsity:.4%}")
    
    # 2. Similarity matrix stats
    print(f"Similarity Matrix Mean: {similarity.mean():.4f}")
    print(f"Similarity Matrix Std:  {similarity.std():.4f}")
    
    # 3. Best matches for a sample movie
    sample_title = "Avatar"
    sample_idx = df[df['title'].str.lower() == sample_title.lower()].index
    if not sample_idx.empty:
        idx = sample_idx[0]
        sim_scores = list(enumerate(similarity[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:6]
        
        print(f"\nTop 5 Recommendations for '{sample_title}':")
        for rank, (movie_idx, score) in enumerate(sim_scores):
            match_title = df.iloc[movie_idx]['title']
            print(f"  {rank+1}. {match_title} (Score: {score:.4f})")


if __name__ == "__main__":
    train()
