document.addEventListener('DOMContentLoaded', () => {
  console.log('report.js loaded at:', new Date().toISOString());

  const isDataFresh = (timestamp) => {
    if (!timestamp) return false;
    const dataTime = new Date(timestamp);
    const currentTime = new Date();
    const diffInMinutes = (currentTime - dataTime) / (1000 * 60);
    return diffInMinutes <= 60;
  };

  function loadCompletedRecommendations() {
    const stored = localStorage.getItem('completedRecommendations');
    return stored ? JSON.parse(stored) : {};
  }

  function saveCompletedRecommendations(completed) {
    localStorage.setItem('completedRecommendations', JSON.stringify(completed));
  }

  let data;
  try {
    console.log('Attempting to retrieve predictionData from localStorage...');
    const predictionData = JSON.parse(localStorage.getItem('predictionData'));
    console.log('Retrieved predictionData:', predictionData);

    if (!predictionData) {
      throw new Error('No prediction data found in localStorage');
    }

    if (predictionData.timestamp && !isDataFresh(predictionData.timestamp)) {
      throw new Error('Prediction data is outdated. Please recalculate.');
    }

    data = predictionData;

    if (data.factorData) {
      Object.keys(data.factorData).forEach(key => {
        data.factorData[key] = Math.min(100, Math.max(0, parseFloat(data.factorData[key]) || 0));
      });
    } else {
      data.factorData = {};
    }

    data.injury_likelihood_percent = parseFloat(data.injury_likelihood_percent) || 0;
    data.model_class_probability = parseFloat(data.model_class_probability) || 0;
    data.predicted_risk_level = data.predicted_risk_level || 'Unknown';
    data.recommendations = data.recommendations || { 'Injury Prevention': [] };
    data.profile = data.profile || { age: 'N/A', gender: 'N/A', sport: 'N/A' };
    data.feature_importance = data.feature_importance || {
      Training_Load_Score: 0.22,
      Recovery_Per_Training: 0.18,
      Total_Weekly_Training_Hours: 0.16,
      Fatigue_Level: 0.14,
      Recovery_Time_Between_Sessions: 0.12,
      High_Intensity_Training_Hours: 0.10,
      Intensity_Ratio: 0.08,
      Endurance_Score: 0.06,
      Sprint_Speed: 0.05,
      Agility_Score: 0.04,
      Flexibility_Score: 0.03,
      Age: 0.03,
      Strength_Training_Frequency: 0.02,
      Sport_Type: 0.02,
      Gender: 0.01,
      Previous_Injury_Count: 0.01,
      Previous_Injury_Type: 0.01
    };
    data.timestamp = data.timestamp || new Date().toISOString();
    data.version = data.version || '1.0.0';

    console.log('Validated and normalized data:', data);
  } catch (error) {
    console.error('Error loading prediction data:', error.message);
    data = {
      predicted_risk_level: 'Unknown',
      injury_likelihood_percent: 0,
      model_class_probability: 0,
      recommendations: { 'Injury Prevention': [{ id: 'rec-0', text: 'Please complete the assessment form to generate a report.', priority: 0.5, details: '', completed: false }] },
      factorData: {
        Training_Load_Score: 0,
        Recovery_Per_Training: 0,
        Total_Weekly_Training_Hours: 0,
        Fatigue_Level: 0,
        Recovery_Time_Between_Sessions: 0,
        High_Intensity_Training_Hours: 0,
        Experience_Level: 0,
        Intensity_Ratio: 0,
        Endurance_Score: 0,
        Sprint_Speed: 0,
        Agility_Score: 0,
        Flexibility_Score: 0,
        Age: 0,
        Strength_Training_Frequency: 0,
        Sport_Type: 0,
        Gender: 0,
        Previous_Injury_Count: 0,
        Previous_Injury_Type: 0
      },
      profile: { age: 'N/A', gender: 'N/A', sport: 'N/A' },
      feature_importance: {
        Training_Load_Score: 0.22,
        Recovery_Per_Training: 0.18,
        Total_Weekly_Training_Hours: 0.16,
        Fatigue_Level: 0.14,
        Recovery_Time_Between_Sessions: 0.12,
        High_Intensity_Training_Hours: 0.10,
        Intensity_Ratio: 0.08,
        Endurance_Score: 0.06,
        Sprint_Speed: 0.05,
        Agility_Score: 0.04,
        Flexibility_Score: 0.03,
        Age: 0.03,
        Strength_Training_Frequency: 0.02,
        Sport_Type: 0.02,
        Gender: 0.01,
        Previous_Injury_Count: 0.01,
        Previous_Injury_Type: 0.01
      },
      timestamp: new Date().toISOString(),
      version: '1.1.0'
    };

    const dashboardContainer = document.querySelector('.dashboard-container');
    if (dashboardContainer) {
      const warningDiv = document.createElement('div');
      warningDiv.style.color = '#ef4444';
      warningDiv.style.marginBottom = '20px';
      warningDiv.style.textAlign = 'center';
      warningDiv.innerHTML = `⚠️ ${error.message} <br><a href="calculator.html" style="color: #00e5ff;">Return to Calculator</a>`;
      dashboardContainer.prepend(warningDiv);
      console.log('Appended warning message to dashboard-container');
    } else {
      console.error('Dashboard container not found in the DOM');
    }
  }

  const reportDateEl = document.getElementById('reportDate');
  if (reportDateEl) {
    reportDateEl.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  } else {
    console.error('Element #reportDate not found');
  }

  const reportIdEl = document.getElementById('reportId');
  if (reportIdEl) {
    reportIdEl.textContent = 'Report ID: ' + Math.random().toString(36).slice(2, 9).toUpperCase();
  } else {
    console.error('Element #reportId not found');
  }

  const riskLevelEl = document.getElementById('riskLevel');
  if (riskLevelEl) {
    riskLevelEl.textContent = data.predicted_risk_level;
  } else {
    console.error('Element #riskLevel not found');
  }

  const likelihoodPercentEl = document.getElementById('likelihoodPercent');
  if (likelihoodPercentEl) {
    likelihoodPercentEl.textContent = `${data.injury_likelihood_percent.toFixed(1)}%`;
  } else {
    console.error('Element #likelihoodPercent not found');
  }

  const confidencePercentEl = document.getElementById('confidencePercent');
  if (confidencePercentEl) {
    confidencePercentEl.textContent = `${data.model_class_probability.toFixed(1)}%`;
  } else {
    console.error('Element #confidencePercent not found');
  }

  const percent = Math.min(Math.max(data.injury_likelihood_percent, 0), 100);
  const gauge = document.querySelector('.gauge-value');
  const gaugeText = document.querySelector('.gauge-text');
  if (gauge && gaugeText) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    gauge.style.transition = 'stroke-dashoffset 1s ease-in-out';
    gauge.style.strokeDasharray = `${circumference} ${circumference}`;
    gauge.style.strokeDashoffset = offset;

    const getRiskColor = (value) => {
      if (value > 70) return '#ef4444';
      if (value > 40) return '#facc15';
      return '#22c55e';
    };

    gauge.style.stroke = getRiskColor(percent);
    gaugeText.textContent = `${percent.toFixed(1)}%`;
  } else {
    console.error('Gauge elements (.gauge-value or .gauge-text) not found');
  }

  const profileCardEl = document.getElementById('profileCard');
  if (profileCardEl) {
    const profile = data.profile;
    profileCardEl.innerHTML = `
      <div class="stat-item"><span class="stat-label">Age</span><span class="stat-value">${profile.age}</span></div>
      <div class="stat-item"><span class="stat-label">Gender</span><span class="stat-value">${profile.gender}</span></div>
      <div class="stat-item"><span class="stat-label">Sport</span><span class="stat-value">${profile.sport}</span></div>
    `;
  } else {
    console.error('Element #profileCard not found');
  }

  const summaryCardEl = document.getElementById('summaryCard');
  if (summaryCardEl) {
    const riskSummary = data.predicted_risk_level.toLowerCase();
    const summaryInsight = riskSummary === 'high' ? 'Immediate action required to reduce risk.' :
                          riskSummary === 'medium' ? 'Monitor and adjust training.' :
                          riskSummary === 'low' ? 'Maintain current regimen.' : 'Complete assessment for insights.';
    summaryCardEl.innerHTML = `
      <div class="stat-item"><span class="stat-label">Risk Overview</span><span class="stat-value">${data.predicted_risk_level}</span></div>
      <div class="stat-item"><span class="stat-label">Key Insight</span><span class="stat-value">${summaryInsight}</span></div>
      <div class="stat-item"><span class="stat-label">Data Confidence</span><span class="stat-value">${data.model_class_probability >= 90 ? 'High' : data.model_class_probability >= 70 ? 'Moderate' : 'Low'}</span></div>
    `;
  } else {
    console.error('Element #summaryCard not found');
  }

  const insightsListEl = document.getElementById('insightsList');
  if (insightsListEl) {
    const topFactors = [
      { key: 'Training_Load_Score', value: data.factorData.Training_Load_Score || 0, importance: data.feature_importance.Training_Load_Score || 0 },
      { key: 'Recovery_Per_Training', value: data.factorData.Recovery_Per_Training || 0, importance: data.feature_importance.Recovery_Per_Training || 0 },
      { key: 'Total_Weekly_Training_Hours', value: data.factorData.Total_Weekly_Training_Hours || 0, importance: data.feature_importance.Total_Weekly_Training_Hours || 0 },
      { key: 'Fatigue_Level', value: data.factorData.Fatigue_Level || 0, importance: data.feature_importance.Fatigue_Level || 0 }
    ];
    insightsListEl.innerHTML = topFactors.map(f => {
      const impact = (f.value * f.importance).toFixed(1);
      const status = f.value > 70 ? '⚠️ High' : f.value > 40 ? '🟡 Moderate' : '✅ Low';
      return `<li><strong>${f.key.replace(/_/g, ' ')}</strong>: <span style="color:#00e5ff;">${f.value.toFixed(1)}%</span> (${status}, Impact: ${impact}%)</li>`;
    }).join('');
  } else {
    console.error('Element #insightsList not found');
  }

  const recommendationsListEl = document.getElementById('recommendationsList');
  if (recommendationsListEl) {
    const completedRecs = loadCompletedRecommendations();
    recommendationsListEl.innerHTML = Object.keys(data.recommendations).map(category => `
      <div class="recommendation-category">
        <h5 class="category-title">${category}</h5>
        ${data.recommendations[category].map(rec => `
          <div class="recommendation-item expandable ${completedRecs[rec.id] ? 'completed' : ''}">
            <input type="checkbox" class="rec-checkbox" data-id="${rec.id}" ${completedRecs[rec.id] ? 'checked' : ''}>
            <span class="priority-indicator" style="color: ${rec.priority > 0.7 ? '#ef4444' : rec.priority > 0.4 ? '#facc15' : '#22c55e'}">
              ${rec.priority > 0.7 ? '🛑' : rec.priority > 0.4 ? '⚠️' : '✅'}
            </span>
            <span class="recommendation-text">${rec.text}</span>
            <span class="tooltip-icon">ℹ️
              <span class="tooltip-text">${rec.details}</span>
            </span>
            <div class="recommendation-detail">${rec.details}</div>
            <button class="learn-more-btn" data-topic="${rec.text.toLowerCase().replace(/\s+/g, '-')}">Learn More</button>
          </div>
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
        const topic = btn.dataset.topic;
        window.open(`https://www.healthline.com/search?q=${encodeURIComponent(topic)}`, '_blank');
      });
    });
  } else {
    console.error('Element #recommendationsList not found');
  }

  const chartDefaults = {
    font: { family: 'Orbitron', size: 12 },
    color: '#fff'
  };
  Chart.defaults.font = chartDefaults.font;
  Chart.defaults.color = chartDefaults.color;

  const makeChart = (id, config) => {
    const ctx = document.getElementById(id);
    if (!ctx) {
      console.error(`Chart element #${id} not found`);
      return null;
    }
    return new Chart(ctx, config);
  };

  const topFeatureKeys = [
    'Training_Load_Score',
    'Recovery_Per_Training',
    'Total_Weekly_Training_Hours',
    'Fatigue_Level',
    'Recovery_Time_Between_Sessions',
    'High_Intensity_Training_Hours',
    'Previous_Injury_Count'
  ];

  const contributions = topFeatureKeys.map(key => ({
    key,
    value: ((data.factorData[key] || 0) * (data.feature_importance[key] || 0))
  }));

  const totalRawContribution = contributions.reduce((sum, c) => sum + c.value, 0);
  const scalingFactor = totalRawContribution > 0 ? data.injury_likelihood_percent / totalRawContribution : 0;
  const scaledContributions = contributions.map(c => ({
    key: c.key,
    value: c.value * scalingFactor
  }));

  const datasets = scaledContributions.map((c, index) => ({
    label: c.key.replace(/_/g, ' '),
    data: [c.value],
    backgroundColor: ['#ef4444', '#facc15', '#22c55e', '#3b82f6', '#a855f7', '#f97316', '#10b981'][index % 7],
    borderWidth: 0
  }));

  console.log('Risk Contribution Breakdown data:', scaledContributions);

  makeChart('trendAnalysisChart', {
    type: 'bar',
    data: {
      labels: ['Risk Contribution'],
      datasets: datasets
    },
    options: {
      indexAxis: 'x',
      plugins: {
        legend: { labels: { font: { size: 12 } } },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`
          }
        },
        title: {
          display: true,
          text: 'Risk Contribution Breakdown',
          font: { size: 16 },
          color: '#fff',
          padding: { top: 10, bottom: 10 }
        }
      },
      scales: {
        x: { 
          stacked: true,
          ticks: { font: { size: 12 } },
          grid: { display: false }
        },
        y: { 
          stacked: true,
          ticks: { font: { size: 12 } },
          beginAtZero: true,
          max: 100,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          title: {
            display: true,
            text: 'Contribution to Risk (%)',
            font: { size: 14 },
            color: '#fff'
          }
        }
      },
      animation: { duration: 1500 }
    }
  });

  makeChart('factorImpactChart', {
    type: 'radar',
    data: {
      labels: topFeatureKeys.map(k => k.replace(/_/g, ' ')),
      datasets: [{
        label: 'Factor Impact',
        data: topFeatureKeys.map(k => data.factorData[k] || 0),
        backgroundColor: 'rgba(0, 229, 255, 0.3)',
        borderColor: '#00e5ff',
        pointBackgroundColor: '#00e5ff',
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      },
      scales: {
        r: {
          angleLines: { 
            color: 'rgba(255, 255, 255, 0.2)',
            lineWidth: 2
          },
          grid: { 
            color: 'rgba(255, 255, 255, 0.2)',
            lineWidth: 2
          },
          ticks: { 
            backdropColor: 'transparent',
            font: { size: 16 },
            stepSize: 20,
            padding: 10
          },
          suggestedMin: 0,
          suggestedMax: 100,
          pointLabels: {
            font: { size: 18 },
            padding: 20
          },
          startAngle: 0,
          offset: false
        }
      },
      plugins: {
        legend: { 
          labels: { 
            font: { size: 16 } 
          },
          position: 'top'
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { size: 16 },
          bodyFont: { size: 14 },
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw.toFixed(1)}% (Importance: ${(data.feature_importance[topFeatureKeys[ctx.dataIndex]] * 100).toFixed(1)}%)`
          }
        }
      }
    }
  });

  const featureImpact = topFeatureKeys.map(k => ((data.factorData[k] || 0) * (data.feature_importance[k] || 0)).toFixed(1));
  makeChart('riskBreakdownChart', {
    type: 'bar',
    data: {
      labels: topFeatureKeys.map(k => k.replace(/_/g, ' ')),
      datasets: [{
        label: 'Impact on Risk',
        data: featureImpact,
        backgroundColor: featureImpact.map(val => val > 15 ? '#ef4444' : val > 10 ? '#facc15' : '#22c55e'),
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw}%`
          }
        }
      },
      scales: {
        x: { ticks: { font: { size: 10 } }, maxRotation: 45, minRotation: 45, grid: { display: false } },
        y: { ticks: { font: { size: 12 } }, beginAtZero: true, max: 25, grid: { color: 'rgba(255,255,255,0.1)' } }
      }
    }
  });

  const allFeatureKeys = Object.keys(data.feature_importance);
  makeChart('featureImportanceChart', {
    type: 'bar',
    data: {
      labels: allFeatureKeys.map(k => k.replace(/_/g, ' ')),
      datasets: [{
        label: 'Feature Importance',
        data: allFeatureKeys.map(k => data.feature_importance[k]),
        backgroundColor: '#3b82f6',
        borderWidth: 0
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `Importance: ${(ctx.raw * 100).toFixed(1)}%`
          }
        }
      },
      scales: {
        x: { ticks: { font: { size: 12 } }, beginAtZero: true, max: 0.25, grid: { color: 'rgba(255,255,255,0.1)' } },
        y: { ticks: { font: { size: 10 } }, grid: { display: false } }
      }
    }
  });

  const calculateRiskProbabilities = (likelihood, riskLevel) => {
    let low = 0, medium = 0, high = 0;
    const normalizedLikelihood = Math.min(100, Math.max(0, parseFloat(likelihood) || 0));

    switch (riskLevel.toLowerCase()) {
      case 'high':
        high = Math.min(normalizedLikelihood, 70);
        medium = Math.max(0, normalizedLikelihood - high);
        low = Math.max(0, 100 - high - medium);
        break;
      case 'medium':
        medium = Math.min(normalizedLikelihood, 60);
        low = Math.max(0, 100 - normalizedLikelihood);
        high = Math.max(0, normalizedLikelihood - medium);
        break;
      case 'low':
      default:
        low = Math.min(100 - normalizedLikelihood, 80);
        medium = Math.max(0, normalizedLikelihood);
        high = 0;
        break;
    }

    const total = low + medium + high;
    if (total !== 100) {
      const adjustment = 100 - total;
      if (high > 0) high += adjustment;
      else if (medium > 0) medium += adjustment;
      else low += adjustment;
    }

    return { Low: low, Medium: medium, High: high };
  };

  const probabilities = calculateRiskProbabilities(data.injury_likelihood_percent, data.predicted_risk_level);
  console.log('Risk Severity Probabilities:', probabilities);

  makeChart('riskDonutChart', {
    type: 'doughnut',
    data: {
      labels: ['Low', 'Medium', 'High'],
      datasets: [{
        data: [probabilities.Low, probabilities.Medium, probabilities.High],
        backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '65%',
      plugins: {
        legend: { labels: { font: { size: 12 } } },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw.toFixed(1)}%`
          }
        },
        title: {
          display: true,
          text: 'Risk Severity Distribution',
          font: { size: 16 },
          color: '#fff',
          padding: { top: 10, bottom: 10 }
        }
      },
      animation: { duration: 1500 }
    }
  });

  makeChart('riskHorizontalBar', {
    type: 'bar',
    data: {
      labels: topFeatureKeys.map(k => k.replace(/_/g, ' ')),
      datasets: [{
        data: topFeatureKeys.map(k => data.factorData[k] || 0),
        backgroundColor: topFeatureKeys.map(k => (data.factorData[k] || 0) > 70 ? '#ef4444' : (data.factorData[k] || 0) > 40 ? '#facc15' : '#22c55e'),
        borderWidth: 0
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw.toFixed(1)}%`
          }
        }
      },
      scales: {
        x: { ticks: { font: { size: 12 } }, beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.1)' } },
        y: { ticks: { font: { size: 12 } }, grid: { display: false } }
      }
    }
  });

  const confidenceVal = data.model_class_probability;
  makeChart('confidenceGaugeChart', {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [confidenceVal, 100 - confidenceVal],
        backgroundColor: [confidenceVal >= 90 ? '#22c55e' : confidenceVal >= 70 ? '#facc15' : '#ef4444', 'rgba(255,255,255,0.05)'],
        borderWidth: 0
      }]
    },
    options: {
      rotation: -90,
      circumference: 180,
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `Confidence: ${ctx.raw.toFixed(1)}%`
          }
        }
      }
    }
  });

  makeChart('trainingRecoveryChart', {
    type: 'bar',
    data: {
      labels: ['Training Load', 'Recovery'],
      datasets: [{
        data: [data.factorData.Training_Load_Score || 0, data.factorData.Recovery_Per_Training || 0],
        backgroundColor: [(data.factorData.Training_Load_Score || 0) > 70 ? '#ef4444' : '#00e5ff', (data.factorData.Recovery_Per_Training || 0) < 40 ? '#ef4444' : '#10b981'],
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw.toFixed(1)}%`
          }
        }
      },
      scales: {
        x: { ticks: { font: { size: 12 } } },
        y: { ticks: { font: { size: 12 } }, beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.1)' } }
      }
    }
  });

  makeChart('performanceScoreChart', {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [data.factorData.Experience_Level || 0, 100 - (data.factorData.Experience_Level || 0)],
        backgroundColor: [(data.factorData.Experience_Level || 0) > 70 ? '#22c55e' : '#facc15', 'rgba(255,255,255,0.05)'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '75%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `Stability: ${ctx.raw.toFixed(1)}%`
          }
        }
      }
    }
  });

  makeChart('fatigueMeterChart', {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [data.factorData.Fatigue_Level || 0, 100 - (data.factorData.Fatigue_Level || 0)],
        backgroundColor: [(data.factorData.Fatigue_Level || 0) > 70 ? '#ef4444' : (data.factorData.Fatigue_Level || 0) > 40 ? '#facc15' : '#22c55e', 'rgba(255,255,255,0.05)'],
        borderWidth: 0
      }]
    },
    options: {
      rotation: -90,
      circumference: 180,
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `Fatigue Risk: ${ctx.raw.toFixed(1)}%`
          }
        }
      }
    }
  });

  const downloadPDFBtn = document.getElementById('downloadPDF');
  if (downloadPDFBtn) {
    downloadPDFBtn.addEventListener('click', () => window.print());
  } else {
    console.error('Element #downloadPDF not found');
  }

  const printReportBtn = document.getElementById('printReport');
  if (printReportBtn) {
    printReportBtn.addEventListener('click', () => window.print());
  } else {
    console.error('Element #printReport not found');
  }

  console.log('Dashboard rendering completed');
});