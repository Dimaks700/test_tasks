from heapq import nlargest
from os.path import abspath
import pandas as pd

def make_report_about_top3(students_avg_scores: dict):
    top3 = nlargest(3, students_avg_scores, key=students_avg_scores.get)
    top3 = pd.DataFrame(top3).to_excel("top3.xlsx")
    return abspath("top3.xlsx")
    
def find_athlets(know_english: list, sportsmen: list, more_than_20_years: list) -> list:
    """function returns the names that are in all the lists"""
    athlets = list(set(know_english).intersection(sportsmen, more_than_20_years))
    return athlets
    
def get_inductees(names: list, birthday_years: list, genders: list) -> list:
    """returns names of inductees, displays corrupted data separately"""
    inductees, unidentified_persons = [], []
    for i in range(len(names)):
        if birthday_years[i] is None or genders[i] is None:
            unidentified_persons.append(names[i])
        elif genders[i] == "Male":
            student_age = 2021 - birthday_years[i]
            if student_age >= 17 and student_age < 30:
                inductees.append(names[i])
    print(f"unidentified_persons: {unidentified_persons}")
    return inductees
 
def find_top_20(candidates: list) -> list:
    """returns the 20 people who scored the most points"""
    for student in candidates:
        student["total_score"] = sum(
            student["scores"].values(), student["extra_scores"]
        )
    sorted_candidates = sorted(
        candidates,
        key=lambda student: (
            student["total_score"],
            student["scores"]["math"] + student["scores"]["computer_science"],
        ),
        reverse=True,
    )
    candidate_names = list()
    for i in range(20):
        candidate_names.append(sorted_candidates[i]["name"])
    return candidate_names
