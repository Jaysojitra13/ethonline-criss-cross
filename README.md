# CrissCross Game with Stackr Integration

CrissCross is a super-simple, addictive game where you transfer dice numbers to a grid. The goal is to group identical numbers to score more points. It's easy to learn, like Sudoku, and perfect for solo play. Carefully plan each move to maximize your score and fill the grid!

## Project Description

CrissCross integrates with Stackr to store proofs of gameplay. By using Stackr, we ensure that each move in the game is securely logged and verified, making the gameplay transparent, tamper-proof, and auditable. This setup is particularly useful for ensuring fairness and trust in multiplayer games or any application where verifiable actions are crucial.

### State Machine on Stackr

- **State Machine**: A computational model used to design algorithms and control logic where an application or system transitions between various states based on inputs and rules. In our game, the state machine on Stackr governs the progression of the game, ensuring that each player's move is valid and that the game transitions smoothly from one state to the next.

- **Stackr Integration**: By building this state machine on Stackr, we leverage its capabilities to ensure that all transitions and states are recorded. This means that every action (e.g., each move in the game) is stored in a verifiable and immutable manner.

### Proof of Gameplay

- Every logged move serves as a proof of gameplay. This proof is publicly verifiable, meaning anyone with access to the Stackr ledger can see the sequence of moves, verify their authenticity, and ensure that the game was played fairly.
- The decentralized nature of Stackr ensures that no single entity can alter or delete these records, making the gameplay data immutable.

### Advantages

- **Transparency**: Players can trust that the game is fair because each move is independently verifiable on Stackr.
- **Auditability**: In cases where disputes arise (e.g., one player claims another cheated), the entire history of moves can be reviewed and verified against the records on Stackr.
- **Immutability**: Once a move is stored on Stackr, it cannot be changed, ensuring that the game history remains intact.

### Game Flow

1. **Game Initialization**: When the game is initialized (`/init-game` endpoint), the initial state of the game is set up and possibly recorded on Stackr as the starting point.

2. **Player Move**: Each time a player makes a move (`/move` endpoint), the move is logged onto Stackr, transitioning the game to the next state.

3. **State Transition**: The state machine on Stackr ensures that each move adheres to the game's rules, validating it before recording.

4. **Verification and Continuation**: After the move is recorded and the state is updated on Stackr, the game continues. Players can view the history of moves, and at the end of the game, the final state is recorded as well.

### How It's Made

To achieve this, we used the following technical components:

- Define a state logic on Stackr to handle game states and transitions.
- Integrate the backend (Node.js/Express) with Stackr’s API or SDK to log each move.
- Manage the state transitions within the state machine and ensure that each move conforms to the game's rules before it's logged on Stackr.

## Quick Start

### Clone the Repository

```bash
git clone https://github.com/vkpatva/ethonline-criss-cross.git
cd ethonline-criss-cross
```

### First Terminal

```bash
cd criss-cross
cp .env.sample .env
yarn
yarn run dev
```

### Second Terminal

```bash
cd stackr
cp .env.sample .env  # Fill in the required values in the .env file
npm install
npm run start
```

Your game will be ready : [frontend](http://localhost:5173)

### Future Plans

- **View All Games and Manage Progress**:

  - Implement a feature to display all games a user has participated in, allowing them to easily resume incomplete games or review completed ones. This will provide players with a comprehensive view of their gaming history and ensure they never lose track of their progress.

- **1v1 Competitive Play**:

  - Introduce a 1v1 game mode where players can challenge each other in a head-to-head match. This feature will add a competitive edge to CrissCross, allowing players to directly compete with friends or random opponents in real-time, making the game more engaging and interactive.

- **Group Play in a Room**:

  - Develop a "Play in Room" feature, where multiple players can join a virtual room and play together. This mode will support group play, enabling friends, family, or community members to engage in a shared gaming experience, fostering a sense of camaraderie and competition among larger groups.

- **Daily Leaderboard and Rankings**:
  - Implement a daily leaderboard to showcase top players based on their performance in the game. This will encourage players to strive for high scores each day, fostering healthy competition and providing motivation for regular gameplay. Players will be able to see how they rank against others and work their way up to the top of the leaderboard.

These future enhancements will further enrich the CrissCross experience, making it more versatile and appealing to a broader audience.
