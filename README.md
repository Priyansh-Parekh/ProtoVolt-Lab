# ProtoVolt-Lab

flowchart TD
    %% --- Section 1: Authentication ---
    A[User visits Circuit Simulator] --> B{Have an account?}
    B -->|Yes| C[Login Page]
    B -->|No| D[Registration Page]
    
    D --> E[Fill Form & Select Role: Student/Professor]
    E --> F{Validation Successful?}
    F -->|No| G[Show Error] & G --> D
    F -->|Yes| H[Create Account] & H --> I[Login]

    C --> J[Enter Credentials]
    J --> K{Valid Credentials?}
    K -->|No| L[Show Error] & L --> J
    K -->|Yes| I

    %% --- Section 2: Main Menu (Post-Login) ---
    I --> M[Home Page]
    M --> N[Personal Workspace]
    M --> O[Classroom]

    %% --- Section 3a: Personal Workspace Flow ---
    N --> P[Circuit Editor]
    P --> Q[Design Circuit]
    Q --> R{Action?}
    R -->|Save| S[Save Circuit to DB] & S --> P
    R -->|Load| T[Load Circuit from DB] & T --> P
    R -->|Analyze| U[Send to AI Solver & Get Results] & U --> P
    R -->|Back to Menu| M

    %% --- Section 3b: Classroom Flow ---
    O --> V{User Role?}
    V -->|Professor| W[Professor Classroom List]
    V -->|Student| X[Student Classroom List]

    %% Professor Path
    W --> Y{Action?}
    Y -->|Create Class| Z[Create Class Form] & Z --> W
    Y -->|Select Class| AA[Individual Class Page (Prof. View)]
    AA --> AB{Action?}
    AB -->|Create Assignment| AC[Create Assignment Page] & AC --> AA
    AB -->|View Submissions| AD[Grading Dashboard] & AD --> AA

    %% Student Path
    X --> AE{Action?}
    AE -->|Join Class| AF[Enter Class Code] & AF --> X
    AE -->|Select Class| AG[Individual Class Page (Stud. View)]
    AG --> AH[Select Assignment]
    AH --> AI[Assignment Workspace]
    AI --> AJ{Action?}
    AJ -->|Work on Circuit| AI
    AJ -->|Submit| AK[Save Submission to DB] & AK --> AG
