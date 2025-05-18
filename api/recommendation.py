# Professional Injury Prevention Recommendation System
"""
Generates evidence-based, personalized injury prevention recommendations for athletes.
Aligned with the injury prediction model and integrated with the frontend.
Recommendations include actionable advice, priorities, detailed explanations, and credible sources.
"""

from typing import List, Dict, Any
import uuid

def generate_recommendations(user_input: Dict[str, Any]) -> List[str]:
    """
    Generate professional, targeted injury prevention strategies.

    Args:
        user_input: Dictionary with fields like Age, Gender, Fatigue_Level, etc.

    Returns:
        List of recommendation strings (simplified for compatibility with existing frontend).
    """
    # Internal structure for recommendations with categories
    internal_recs = {
        "Recovery Strategies": [],
        "Training Adjustments": [],
        "Injury Prevention": [],
        "Nutrition": [],
        "Mental Health": [],
        "Sport-Specific Warm-Ups": []
    }

    # Helper function to calculate priority
    def calculate_priority(factor_value: float, threshold: float, weight: float) -> float:
        return min(1.0, max(0.0, (factor_value / threshold) * weight))

    # Fatigue Management
    fatigue = user_input.get("Fatigue_Level", 5)
    if fatigue >= 8:
        internal_recs["Recovery Strategies"].append({
            "id": str(uuid.uuid4()),
            "text": "High fatigue detected. Prioritize 48–72 hours of active recovery with hydration and 8+ hours of sleep nightly.",
            "priority": calculate_priority(fatigue, 10, 0.9),
            "details": "Incorporate light stretching and 2–3L of water daily. Monitor sleep quality with a tracker for optimal recovery.",
            "source": "https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/recovery/art-20057777",
            "category": "Recovery Strategies"
        })
    elif fatigue >= 6:
        internal_recs["Recovery Strategies"].append({
            "id": str(uuid.uuid4()),
            "text": "Elevated fatigue: Reduce high-intensity sessions by 20% this week and monitor soreness.",
            "priority": calculate_priority(fatigue, 10, 0.7),
            "details": "Use foam rolling for 10–15 minutes post-session to alleviate muscle tension and promote circulation.",
            "source": "https://www.nsca.com/education/articles/recovery-techniques-for-athletes/",
            "category": "Recovery Strategies"
        })

    # Recovery Time Optimization
    recovery = user_input.get("Recovery_Time_Between_Sessions", 12)
    if recovery < 8:
        internal_recs["Recovery Strategies"].append({
            "id": str(uuid.uuid4()),
            "text": "Insufficient recovery time. Increase rest to 12–24 hours between sessions.",
            "priority": calculate_priority(8 - recovery, 8, 0.8),
            "details": "Schedule sessions to allow muscle repair, especially after high-intensity workouts, to reduce injury risk.",
            "source": "https://pubmed.ncbi.nlm.nih.gov/28933711/",
            "category": "Recovery Strategies"
        })

    # Intensity Ratio Check
    total_hours = max(user_input.get("Total_Weekly_Training_Hours", 1), 1)
    hi_hours = user_input.get("High_Intensity_Training_Hours", 0)
    intensity_ratio = hi_hours / total_hours
    if intensity_ratio > 0.7:
        internal_recs["Training Adjustments"].append({
            "id": str(uuid.uuid4()),
            "text": "High-intensity training exceeds 70%. Shift to 60% low-intensity/technical work.",
            "priority": calculate_priority(intensity_ratio, 1, 0.75),
            "details": "Incorporate drills focusing on technique or endurance to balance training load and prevent overtraining.",
            "source": "https://www.acsm.org/docs/default-source/files-for-resource-library/overtraining.pdf",
            "category": "Training Adjustments"
        })

    # Previous Injury Consideration
    injury_count = user_input.get("Previous_Injury_Count", 0)
    if injury_count >= 2:
        internal_recs["Injury Prevention"].append({
            "id": str(uuid.uuid4()),
            "text": "Multiple injuries noted. Add daily mobility and strength balance exercises.",
            "priority": calculate_priority(injury_count, 5, 0.85),
            "details": "Perform exercises like single-leg squats and hip bridges for 15 minutes daily to enhance joint stability.",
            "source": "https://www.physio-pedia.com/Injury_Prevention_in_Sports",
            "category": "Injury Prevention"
        })

    # Flexibility and Agility
    flexibility = user_input.get("Flexibility_Score", 5)
    if flexibility < 5:
        internal_recs["Injury Prevention"].append({
            "id": str(uuid.uuid4()),
            "text": "Low flexibility. Include 10–15 minutes of dynamic warm-ups and static stretching daily.",
            "priority": calculate_priority(5 - flexibility, 5, 0.65),
            "details": "Focus on hamstrings, hip flexors, and shoulders with stretches like lunges and arm circles to improve range of motion.",
            "source": "https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931",
            "category": "Injury Prevention"
        })

    agility = user_input.get("Agility_Score", 5)
    if agility < 5:
        internal_recs["Training Adjustments"].append({
            "id": str(uuid.uuid4()),
            "text": "Improve agility with cone drills and ladder exercises twice weekly.",
            "priority": calculate_priority(5 - agility, 5, 0.6),
            "details": "Perform 3 sets of 10 reps for drills like lateral shuffles or T-drills to enhance quickness and coordination.",
            "source": "https://www.nsca.com/education/articles/agility-and-quickness-training/",
            "category": "Training Adjustments"
        })

    # Strength Training Frequency
    strength_freq = user_input.get("Strength_Training_Frequency", 0)
    if strength_freq < 2:
        internal_recs["Training Adjustments"].append({
            "id": str(uuid.uuid4()),
            "text": "Increase strength training to 2–3 sessions/week for joint stability.",
            "priority": calculate_priority(2 - strength_freq, 2, 0.7),
            "details": "Include compound lifts like squats and deadlifts with moderate weights to build resilience.",
            "source": "https://www.acsm.org/docs/default-source/files-for-resource-library/strength-training.pdf",
            "category": "Training Adjustments"
        })

    # Nutrition for Recovery
    if fatigue >= 6 or recovery < 12:
        internal_recs["Nutrition"].append({
            "id": str(uuid.uuid4()),
            "text": "Optimize nutrition with 1.2–2.0g/kg body weight protein daily for recovery.",
            "priority": calculate_priority(max(fatigue, 12 - recovery), 10, 0.6),
            "details": "Consume protein-rich meals within 2 hours post-workout (e.g., chicken, eggs, or whey) to support muscle repair.",
            "source": "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8",
            "category": "Nutrition"
        })

    # Mental Health
    if fatigue >= 7:
        internal_recs["Mental Health"].append({
            "id": str(uuid.uuid4()),
            "text": "Address mental fatigue with 10–15 minutes of mindfulness or meditation daily.",
            "priority": calculate_priority(fatigue, 10, 0.55),
            "details": "Use guided meditation apps or breathing exercises to reduce stress and improve focus.",
            "source": "https://www.mayoclinic.org/tests-procedures/meditation/in-depth/meditation/art-20045858",
            "category": "Mental Health"
        })

    # Sport-Specific Warm-Ups
    sport_type = user_input.get("Sport_Type", 0)
    if sport_type == 0:  # Football
        internal_recs["Sport-Specific Warm-Ups"].append({
            "id": str(uuid.uuid4()),
            "text": "Football: Perform dynamic warm-ups with high-knee sprints and lateral cuts for 10 minutes.",
            "priority": 0.6,
            "details": "Focus on explosive movements to prepare for sprinting and tackling demands.",
            "source": "https://www.nsca.com/education/articles/warm-ups-for-soccer/",
            "category": "Sport-Specific Warm-Ups"
        })
    elif sport_type == 3:  # Running
        internal_recs["Sport-Specific Warm-Ups"].append({
            "id": str(uuid.uuid4()),
            "text": "Running: Include 10-minute warm-ups with leg swings and walking lunges.",
            "priority": 0.6,
            "details": "Emphasize hip mobility and gradual pace increases to prevent shin splints and strains.",
            "source": "https://www.runnersworld.com/training/a20787998/dynamic-warmup/",
            "category": "Sport-Specific Warm-Ups"
        })

    # Age-Based Recommendations
    age = user_input.get("Age", 30)
    if age > 40:
        internal_recs["Injury Prevention"].append({
            "id": str(uuid.uuid4()),
            "text": "Age over 40: Add low-impact cross-training (e.g., swimming, yoga) twice weekly.",
            "priority": calculate_priority(age - 40, 40, 0.6),
            "details": "Low-impact activities reduce joint stress while maintaining fitness.",
            "source": "https://www.arthritis.org/health-wellness/healthy-living/physical-activity/other-activities/low-impact-exercises",
            "category": "Injury Prevention"
        })

    # Gender-Specific Recommendations
    gender = user_input.get("Gender", 0)
    if gender == 1:  # Female
        internal_recs["Injury Prevention"].append({
            "id": str(uuid.uuid4()),
            "text": "Female athletes: Include pelvic floor exercises 3 times/week to support core stability.",
            "priority": 0.65,
            "details": "Exercises like Kegels strengthen the pelvic floor, reducing injury risk during high-impact activities.",
            "source": "https://www.womenshealthmag.com/fitness/a20709126/pelvic-floor-exercises/",
            "category": "Injury Prevention"
        })

    # Flatten recommendations for compatibility with existing frontend
    flat_recommendations = []
    for category in internal_recs:
        for rec in internal_recs[category]:
            flat_recommendations.append(rec["text"])

    return flat_recommendations