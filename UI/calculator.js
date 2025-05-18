document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("predictionForm");
  const resultContainer = document.getElementById("result-container");

  if (resultContainer) {
    resultContainer.style.display = 'none';
  }

  // Validation helper
  const validateField = (input) => {
    const value = input.value.trim();
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    if (!value) return false;
    if (input.type === 'number') {
      const numValue = parseFloat(value);
      return !isNaN(numValue) && numValue >= min && numValue <= max;
    }
    return true;
  };

  // Add validation feedback
  const addValidationFeedback = (input) => {
    const validateInput = () => {
      const formGroup = input.closest('.form-group');
      const value = input.value.trim();
      const isValid = value !== '' && validateField(input);

      formGroup.classList.remove('error', 'success');
      formGroup.classList.add(isValid ? 'success' : 'error');

      const existingMessage = formGroup.querySelector('.validation-message');
      if (existingMessage) existingMessage.remove();

      const message = document.createElement('div');
      message.className = `validation-message ${isValid ? 'success' : 'error'}`;
      message.textContent = value === '' ? 'This field is required' : 
                           (isValid ? 'Valid input' : 'Please check the value');
      formGroup.appendChild(message);

      return isValid;
    };

    input.addEventListener('input', validateInput);
    input.addEventListener('blur', validateInput);
  };

  document.querySelectorAll('input, select').forEach(addValidationFeedback);

  // Animate counter
  function animateCounter(element, target) {
    let start = 0;
    const duration = 1000;
    const stepTime = Math.abs(Math.floor(duration / target));
    const timer = setInterval(() => {
      start++;
      element.textContent = start + '%';
      if (start >= target) clearInterval(timer);
    }, stepTime);
  }

  // Update gauge SVG
  function updateGauge(elementId, percent, textId, tooltipId, tooltipMessages) {
    const gauge = document.querySelector(elementId);
    const text = document.querySelector(textId);
    const tooltip = document.querySelector(tooltipId);
    const radius = elementId.includes('radial') ? 40 : 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    gauge.style.strokeDasharray = `${circumference} ${circumference}`;
    gauge.style.strokeDashoffset = offset;
    if (text) text.textContent = `${Math.round(percent)}%`;
    
    if (tooltip && tooltipMessages) {
      if (percent >= 75) {
        tooltip.textContent = tooltipMessages.high;
      } else if (percent >= 50) {
        tooltip.textContent = tooltipMessages.medium;
      } else {
        tooltip.textContent = tooltipMessages.low;
      }
    }
  }

  // Mapping of recommendation keywords to professional resources
  const resourceLinks = {
    'training': {
      url: 'https://www.acsm.org/docs/default-source/files-for-resource-library/acsms-guidelines-for-exercise-testing-and-prescription-(10th-ed.).pdf',
      source: 'American College of Sports Medicine'
    },
    'intensity': {
      url: 'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/exercise-intensity/art-20046887',
      source: 'Mayo Clinic'
    },
    'recovery': {
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5592286/',
      source: 'PubMed - Sports Medicine Journal'
    },
    'rest': {
      url: 'https://www.sleepfoundation.org/physical-activity/athletic-performance-and-sleep',
      source: 'Sleep Foundation'
    },
    'injury': {
      url: 'https://orthoinfo.aaos.org/en/diseases--conditions/sports-injuries/',
      source: 'American Academy of Orthopaedic Surgeons'
    },
    'prevention': {
      url: 'https://www.nata.org/professional-interests/safe-sports-environments/injury-prevention',
      source: 'National Athletic Trainers\' Association'
    }
  };

  // Enhanced recommendation processing
  function enhanceRecommendations(recommendations, factorData, featureImportance) {
    const categories = {
      'Training Adjustments': [],
      'Recovery Strategies': [],
      'Injury Prevention': []
    };

    recommendations.forEach((rec, index) => {
      let category = 'Injury Prevention';
      if (rec.toLowerCase().includes('training') || rec.toLowerCase().includes('intensity')) {
        category = 'Training Adjustments';
      } else if (rec.toLowerCase().includes('recovery') || rec.toLowerCase().includes('rest')) {
        category = 'Recovery Strategies';
      }

      const priority = calculatePriority(rec, factorData, featureImportance);
      
      // Find the most relevant resource link
      let resource = { url: 'https://www.healthline.com/health/sports-injuries', source: 'Healthline' };
      for (const [keyword, link] of Object.entries(resourceLinks)) {
        if (rec.toLowerCase().includes(keyword)) {
          resource = link;
          break;
        }
      }

      categories[category].push({
        id: `rec-${index}`,
        text: rec,
        priority: priority,
        details: generateDetails(rec, factorData),
        completed: false,
        resourceUrl: resource.url,
        resourceSource: resource.source
      });
    });

    Object.keys(categories).forEach(category => {
      categories[category].sort((a, b) => b.priority - a.priority);
    });

    return categories;
  }

  function calculatePriority(recommendation, factorData, featureImportance) {
    let priority = 0.5;
    const keywords = {
      'Training_Load_Score': ['training', 'intensity'],
      'Fatigue_Level': ['fatigue', 'rest'],
      'Recovery_Time_Between_Sessions': ['recovery', 'rest'],
      'Previous_Injury_Count': ['injury', 'prevention']
    };

    Object.keys(keywords).forEach(key => {
      if (keywords[key].some(kw => recommendation.toLowerCase().includes(kw))) {
        const impact = (factorData[key] || 0) * (featureImportance[key] || 0);
        priority = Math.max(priority, impact);
      }
    });

    return Math.min(1, Math.max(0, priority));
  }

  function generateDetails(recommendation, factorData) {
    if (recommendation.toLowerCase().includes('training') && factorData.High_Intensity_Training_Hours > 10) {
      return `Reduce high-intensity sessions by 1-2 hours/week to lower training load.`;
    } else if (recommendation.toLowerCase().includes('recovery') && factorData.Recovery_Time_Between_Sessions < 12) {
      return `Increase rest periods to at least 12 hours between sessions.`;
    } else if (recommendation.toLowerCase().includes('injury') && factorData.Previous_Injury_Count > 2) {
      return `Consult a physiotherapist to address recurring injury risks.`;
    }
    return `Follow this recommendation consistently for optimal results.`;
  }

  function loadCompletedRecommendations() {
    const stored = localStorage.getItem('completedRecommendations');
    return stored ? JSON.parse(stored) : {};
  }

  function saveCompletedRecommendations(completed) {
    localStorage.setItem('completedRecommendations', JSON.stringify(completed));
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      document.querySelectorAll('.validation-message').forEach(msg => msg.remove());
      document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));

      const inputs = form.querySelectorAll('input, select');
      let isValid = true;

      inputs.forEach(input => {
        const value = input.value.trim();
        const formGroup = input.closest('.form-group');

        if (value === '') {
          isValid = false;
          formGroup.classList.add('error');
          const message = document.createElement('div');
          message.className = 'validation-message error';
          message.innerHTML = `<strong>Required:</strong> Please fill out this field`;
          formGroup.appendChild(message);

          input.classList.add('shake');
          setTimeout(() => input.classList.remove('shake'), 500);

          input.style.borderColor = '#ef4444';
          input.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.3)';
        }
      });

      if (!isValid) {
        const firstError = form.querySelector('.form-group.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const rawData = Object.fromEntries(new FormData(form).entries());
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const genderMap = { "Male": 0, "Female": 1 };
      const experienceMap = {
        "Beginner": 0,
        "Intermediate": 1,
        "Advanced": 2,
        "Professional": 3
      };
      const injuryTypeMap = {
        "None": 0,
        "Sprain": 1,
        "Ligament Tear": 2,
        "Tendonitis": 3,
        "Strain": 4,
        "Fracture": 5
      };
      const sportTypeMap = {
        "Football": 0,
        "Basketball": 1,
        "Swimming": 2,
        "Running": 3,
        "Tennis": 4,
        "Volleyball": 5
      };

      data.Gender = genderMap[data.Gender] ?? 0;
      data.Experience_Level = experienceMap[data.Experience_Level] ?? 0;
      data.Previous_Injury_Type = injuryTypeMap[data.Previous_Injury_Type] ?? 0;
      data.Sport_Type = sportTypeMap[data.Sport_Type] ?? 0;

      Object.keys(data).forEach(key => {
        data[key] = isNaN(data[key]) ? 0 : parseFloat(data[key]);
      });

      const outlierWarnings = [];
      if (data.Age < 18 && data.Total_Weekly_Training_Hours > 40) {
        outlierWarnings.push('Unusual training hours for age under 18. Consider reducing to prevent burnout.');
      }
      if (data.Sprint_Speed > 10 && data.Age > 50) {
        outlierWarnings.push('Sprint speed seems high for age over 50. Please verify this value.');
      }
      if (data.Fatigue_Level > 8 && data.Recovery_Time_Between_Sessions < 12) {
        outlierWarnings.push('High fatigue with low recovery time may skew results. Consider adjusting inputs.');
      }
      if (outlierWarnings.length > 0) {
        const warningDiv = document.createElement('div');
        warningDiv.style.color = '#facc15';
        warningDiv.style.marginBottom = '20px';
        warningDiv.innerHTML = `<strong>Warning:</strong><ul>${outlierWarnings.map(w => `<li>${w}</li>`).join('')}</ul>`;
        form.appendChild(warningDiv);
      }

      try {
        console.log('Sending prediction request to server:', data);
        const response = await fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Prediction failed");

        const result = await response.json();
        console.log('Received prediction result:', result);

        const {
          predicted_risk_level,
          injury_likelihood_percent,
          model_class_probability,
          recommendations,
          feature_importance
        } = result;

        if (!predicted_risk_level || typeof injury_likelihood_percent !== 'number' || !Array.isArray(recommendations)) {
          throw new Error("Invalid API response format");
        }

        const trainingLoad = Math.min(100, Math.max(0, (parseFloat(data.Training_Load_Score) / 100) * 100));
        const recoveryStatus = Math.min(100, Math.max(0, (parseFloat(data.Recovery_Time_Between_Sessions) / 48) * 100));
        const injuryImpact = Math.min(100, Math.max(0, (parseFloat(data.Previous_Injury_Count) / 10) * 100));
        const recoveryPerTraining = data.Total_Weekly_Training_Hours > 0
          ? Math.min(100, Math.max(0, (parseFloat(data.Recovery_Time_Between_Sessions) / parseFloat(data.Total_Weekly_Training_Hours)) * 100))
          : 0;
        const totalWeeklyHours = Math.min(100, Math.max(0, (parseFloat(data.Total_Weekly_Training_Hours) / 50) * 100));
        const fatigueLevel = Math.min(100, Math.max(0, (parseFloat(data.Fatigue_Level) / 10) * 100));
        const highIntensityHours = Math.min(100, Math.max(0, (parseFloat(data.High_Intensity_Training_Hours) / 20) * 100));
        const experienceLevel = Math.min(100, Math.max(0, (data.Experience_Level / 3) * 100));

        const defaultFeatureImportance = {
          Training_Load_Score: 0.22,
          Recovery_Per_Training: 0.18,
          Total_Weekly_Training_Hours: 0.16,
          Fatigue_Level: 0.14,
          Recovery_Time_Between_Sessions: 0.12,
          High_Intensity_Training_Hours: 0.10
        };
        const finalFeatureImportance = feature_importance || defaultFeatureImportance;

        const enhancedRecommendations = enhanceRecommendations(recommendations, {
          Training_Load_Score: trainingLoad,
          Recovery_Per_Training: recoveryPerTraining,
          Total_Weekly_Training_Hours: totalWeeklyHours,
          Fatigue_Level: fatigueLevel,
          Recovery_Time_Between_Sessions: recoveryStatus,
          High_Intensity_Training_Hours: highIntensityHours,
          Previous_Injury_Count: injuryImpact
        }, finalFeatureImportance);

        const fullReportData = {
          predicted_risk_level,
          injury_likelihood_percent,
          model_class_probability,
          recommendations: enhancedRecommendations,
          feature_importance: finalFeatureImportance,
          factorData: {
            Training_Load_Score: trainingLoad,
            Recovery_Per_Training: recoveryPerTraining,
            Total_Weekly_Training_Hours: totalWeeklyHours,
            Fatigue_Level: fatigueLevel,
            Recovery_Time_Between_Sessions: recoveryStatus,
            High_Intensity_Training_Hours: highIntensityHours,
            Experience_Level: experienceLevel,
            Intensity_Ratio: data.High_Intensity_Training_Hours > 0
              ? Math.min(100, Math.max(0, (parseFloat(data.High_Intensity_Training_Hours) / parseFloat(data.Total_Weekly_Training_Hours)) * 100))
              : 0,
            Endurance_Score: Math.min(100, Math.max(0, (parseFloat(data.Endurance_Score) / 10) * 100)),
            Sprint_Speed: Math.min(100, Math.max(0, (parseFloat(data.Sprint_Speed) / 20) * 100)),
            Agility_Score: Math.min(100, Math.max(0, (parseFloat(data.Agility_Score) / 10) * 100)),
            Flexibility_Score: Math.min(100, Math.max(0, (parseFloat(data.Flexibility_Score) / 10) * 100)),
            Age: Math.min(100, Math.max(0, (parseFloat(data.Age) / 80) * 100)),
            Strength_Training_Frequency: Math.min(100, Math.max(0, (parseFloat(data.Strength_Training_Frequency) / 7) * 100)),
            Sport_Type: Math.min(100, Math.max(0, data.Sport_Type * 20)),
            Gender: data.Gender * 100,
            Previous_Injury_Count: injuryImpact,
            Previous_Injury_Type: Math.min(100, Math.max(0, data.Previous_Injury_Type * 20))
          },
          profile: {
            age: rawData.Age,
            gender: rawData.Gender,
            sport: rawData.Sport_Type
          },
          timestamp: new Date().toISOString(),
          version: '1.1.0'
        };

        console.log('Storing prediction data in localStorage:', fullReportData);
        localStorage.setItem('predictionData', JSON.stringify(fullReportData));

        document.getElementById('risk-level').textContent = predicted_risk_level;
        document.getElementById('likelihood-percent').textContent = `${Math.round(injury_likelihood_percent)}%`;
        updateGauge('.summary-gauge .gauge-value', injury_likelihood_percent, '.summary-gauge .gauge-text', null, null);

        updateGauge('#training-load-gauge', trainingLoad, '#training-load-text', '#training-load-tooltip', {
          high: 'High training load may significantly increase injury risk.',
          medium: 'Moderate training load; monitor closely.',
          low: 'Low training load; risk appears minimal.'
        });
        updateGauge('#recovery-gauge', recoveryStatus, '#recovery-text', '#recovery-tooltip', {
          high: 'Excellent recovery time; low risk from this factor.',
          medium: 'Moderate recovery; consider increasing rest.',
          low: 'Insufficient recovery may elevate injury risk.'
        });
        updateGauge('#injury-history-gauge', injuryImpact, '#injury-history-text', '#injury-history-tooltip', {
          high: 'Significant injury history; high risk of recurrence.',
          medium: 'Moderate injury history; take preventive measures.',
          low: 'Minimal injury history; low risk from this factor.'
        });

        const recommendationListEl = document.querySelector('.recommendation-list');
        const completedRecs = loadCompletedRecommendations();
        recommendationListEl.innerHTML = Object.keys(enhancedRecommendations).map(category => `
          <div class="recommendation-category">
            <h5 class="category-title">${category}</h5>
            ${enhancedRecommendations[category].map(rec => `
              <li class="recommendation-item expandable ${completedRecs[rec.id] ? 'completed' : ''}">
                <input type="checkbox" class="rec-checkbox" data-id="${rec.id}" ${completedRecs[rec.id] ? 'checked' : ''}>
                <span class="priority-indicator" style="color: ${rec.priority > 0.7 ? '#ef4444' : rec.priority > 0.4 ? '#facc15' : '#22c55e'}">
                  ${rec.priority > 0.7 ? '🛑' : rec.priority > 0.4 ? '⚠️' : '✅'}
                </span>
                <span class="recommendation-summary">${rec.text}</span>
                <span class="tooltip-icon">ℹ️
                  <span class="tooltip-text">${rec.details}</span>
                </span>
                <div class="recommendation-detail">${rec.details}</div>
                <button class="learn-more-btn" data-url="${rec.resourceUrl}" title="Source: ${rec.resourceSource}">Learn More</button>
              </li>
            `).join('')}
          </div>
        `).join('');

        document.querySelectorAll('.rec-checkbox').forEach(checkbox => {
          checkbox.addEventListener('change', () => {
            const recId = checkbox.dataset.id;
            const completedRecs = loadCompletedRecommendations();
            completedRecs[recId] = checkbox.checked;
            saveCompletedRecommendations(completedRecs);
            checkbox.closest('.recommendation-item').classList.toggle('completed', checkbox.checked);
          });
        });

        document.querySelectorAll('.recommendation-item.expandable').forEach(item => {
          item.addEventListener('click', (e) => {
            if (e.target.classList.contains('rec-checkbox') || e.target.classList.contains('learn-more-btn')) return;
            const detail = item.querySelector('.recommendation-detail');
            if (detail.style.display === "none" || detail.style.display === "") {
              detail.style.display = "block";
              detail.style.maxHeight = detail.scrollHeight + "px";
            } else {
              detail.style.display = "none";
              detail.style.maxHeight = "0";
            }
          });
        });

        document.querySelectorAll('.learn-more-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const url = btn.dataset.url;
            window.open(url, '_blank');
          });
        });

        resultContainer.style.display = 'block';
        resultContainer.classList.remove("hidden");
        setTimeout(() => {
          resultContainer.classList.add("visible");
        }, 100);
        resultContainer.scrollIntoView({ behavior: "smooth" });

        const reportActions = document.createElement('div');
        reportActions.className = 'report-actions';
        reportActions.innerHTML = `
          <button onclick="window.location.href='report.html'" class="action-button">
            View Detailed Analysis
          </button>
        `;
        resultContainer.appendChild(reportActions);
      } catch (err) {
        console.error('Prediction error:', err.message);
        const resultOutput = document.createElement('div');
        resultOutput.innerHTML = `<p style="color: red;">Error: ${err.message}. Please ensure the prediction server is running and try again.</p>`;
        form.appendChild(resultOutput);
      }
    });
  }
});