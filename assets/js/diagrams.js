// =====================================================
// DIAGRAMS — Définitions Mermaid injectées via JS
// (évite les problèmes d'échappement HTML avec <<>>)
// =====================================================

const DIAGRAMS_DEFS = {

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

    'diagram-uml': `classDiagram
    class Domain {
        +catalog Product[]
        +analyzeData() Report
        +generateReport() Report
    }
    class Product {
        +id string
        +name string
        +price number
        +type string
        +stripeLink string
    }
    class PaymentPort {
        <<interface>>
        +pay(product Product)
        +refund(orderId string)
    }
    class RepoPort {
        <<interface>>
        +getProjects() Repo[]
    }
    class StripeAdapter {
        +createCheckout(product Product)
        +handleWebhook(event Event)
    }
    class GitHubAdapter {
        +fetchRepos(username string)
        +getStats(repo string)
    }
    Domain --> PaymentPort : uses
    Domain --> RepoPort : uses
    PaymentPort <|.. StripeAdapter : implements
    RepoPort <|.. GitHubAdapter : implements
    Domain *-- Product : contains`,

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
