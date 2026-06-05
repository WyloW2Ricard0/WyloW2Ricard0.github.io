// =====================================================
// DIAGRAMS — Définitions Mermaid injectées via JS
// (évite les problèmes d'échappement HTML avec <<>>)
// =====================================================

const DIAGRAMS_DEFS = {

    'diagram-mindmap': `mindmap
  root(("🎯 Data Analyst"))
    id1["📊 Descriptive & Exploratory\nData Analysis"]
      Aggregation
      Mean
      Median
      SD
      SEM
      id1a["Box Plot"]
      Histogram
      id1b["Scatter Plot"]
      id1c["Pair Plot"]
      id1d["Correlation Matrix"]
      Heatmap
      Dendogram
      id1e["Bubble Plot"]
      id1f["Bi-Plot"]
      id1g["Q-Q Plot"]
      id1h["Statistical cultures"]
        id1h1["Frequentist Inferences"]
        id1h2["Bayesian Statistics"]
        id1h3["Information Theoretics"]
        id1h4["Agility Scrum/Kanban DataOps"]
    id2["🧹 Data Preparation"]
      id2a["Outlier Detection"]
      Duplicates
      id2b["Missing Data"]
      id2c["Cleaning / Reduction"]
      Imputation
      id2d["Hot-Deck"]
      id2e["Frequency Distribution"]
      Skewness
      Kurtosis
      id2f["Data Transformation"]
        id2f1["Normalisation / Standardisation / Scaling"]
        Quantile
        power
        id2f2["z-score"]
        MinMax
        Robust
        id2f3["sqr-root"]
        log
      id2g["Data Traceability"]
    id3["📐 Modelling"]
      id3a["🔮 Forecasting"]
        id3a1["Mixed (Maximum Likelihood)"]
        Predictive
        id3a2["Temporal (Time Series)"]
        id3a3["AR1 / AR2"]
        ARIMA
      id3b["Performance Indicator"]
      id3c["Model Validation"]
        id3c1["Training Set"]
        id3c2["Test Set"]
      id3d["Error Metrics"]
        ME
        MSE
        RMSE
        id3d1["Lin's CCC"]
        id3d2["ROC - AUC"]
      Regularisation
      id3e["Hyperparameter tuning"]
      id3f["Cross-validation k-fold"]
      id3g["Accuracy / Recall / F1"]
      id3h["Pearson's"]
      id3i["Spearman's Rank"]
      Correlation
      Parametric
      id3j["Non-Parametric"]
      id3k["Model Selection & Multi-Model Inferences AIC BIC"]
      id3l["Post-hoc Tests Tukey Bonferroni"]
      id3m["Confidence Intervals"]
    id4["📏 Analysis of Variance (A/B testing)"]
      Simple
      id4a["Multiple (MANOVA)"]
      id4b["Design"]
        Balanced
        id4c["Un-Balanced"]
    id5["📈 Data Visualisation"]
      id5a["Dashboarding"]
        Tableau
        id5b["Streamlit (web app)"]
        id5c["Jupyter Notebooks / Lab"]
      id5d["Cook's Distance"]
      Leverage
      id5e["Residual Analysis"]
    id6["🤖 Machine Learning"]
      id6a["Feature Engineering"]
      id6b["Supervised Learning"]
        id6b1["Regression"]
          OLS
          id6b1a["Simple / Multiple"]
          id6b1b["Linear / Non-Linear"]
          id6b1c["Tree-based"]
        id6b2["Classification"]
          id6b2a["Naïve Bayes"]
          XGBoost
          id6b2b["Logistic regression"]
          SVM
          id6b2c["Decision Tree"]
          id6b2d["Random Forest"]
      id6c["Unsupervised Learning"]
        id6c1["Dimensionality Reduction"]
          PCA
          CA
          nMDS
        id6c2["Clustering"]
          id6c2a["k-means"]
          RDA
          Hierarchical
          CCA
          id6c2b["k-nearest neighbours"]
          DBScan
      id6d["Ensemble Learning"]
        Bootstrapping
        id6d1["Bagging (e.g. RF)"]
        id6d2["Boosting (e.g. AdaBoost)"]
        Stacking
      id6e["Auto-ML (Pipeline automation)"]
      id6f["Regularisation"]
        id6f1["Ridge Regression"]
        id6f2["Lasso Regression"]
    id7["🗄️ Database Management System"]
      id7a["Data Lake"]
      id7b["Data Repository"]
      id7c["Data Warehouse"]
      id7d["Data Mart"]
      id7e["ETL/ELT tools (Talend)"]
      Dimension
      id7f["Fact Table"]
      id7g["DB Schema"]
      Star
      Galaxy
      id7h["3NF Strategy"]
      id7i["Data Vault (2.0)"]
      id7j["Data Warehousing"]
      Snowflake
    id8["💼 Business Intelligence"]
      id8a["Data Governance (GDRP/MDM)"]
      id8b["Relational DB (SQL-based)"]
        PostgreSQL
        id8b1["Snowflake (Cloud-based)"]
      id8c["Multidimensional DB"]
        id8c1["OLAP Cube (SQL Server)"]
      id8d["Non-Relational DB (NoSQL)"]
        MongoDB`,

    'diagram-hero': `graph LR
    A[🗄️ Données] --> B((Mnémosyne))
    C[💼 Métier] --> B
    D[💻 Code] --> B
    B --> E[✅ Solutions]
    style B fill:#58a6ff,color:#0d1117,stroke:#58a6ff
    style E fill:#3fb950,color:#0d1117,stroke:#3fb950`,

    'diagram-consulting': `flowchart LR
    A[Besoin client] --> B[Audit]
    B --> C[Analyse données]
    C --> D[Modélisation]
    D --> E[Prototype]
    E --> F{Validation}
    F -- OK --> G[Livraison]
    F -- Révision --> D
    G --> H[Support]`,

    'diagram-scrum': `flowchart TD
    PB[Product Backlog] --> SP[Sprint Planning]
    SP --> SB[Sprint Backlog]
    SB --> Dev[Sprint 2 semaines]
    Dev --> SR[Sprint Review]
    SR --> RT[Rétrospective]
    RT --> PB
    SR --> Prod[Livraison]`,

    'diagram-stats': `flowchart LR
    Raw[Données brutes] --> Clean[Nettoyage]
    Clean --> EDA[Analyse exploratoire]
    EDA --> Desc[Stats descriptives]
    EDA --> Hyp[Tests d hypothèses]
    Desc --> Model[Modélisation]
    Hyp --> Model
    Model --> Val[Validation R²]
    Val --> Viz[Visualisation]
    Viz --> Report[Rapport]`,
};

// Injecter les définitions dans les éléments DOM
Object.entries(DIAGRAMS_DEFS).forEach(([id, def]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = def;
});
