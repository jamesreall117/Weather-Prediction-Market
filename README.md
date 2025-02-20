# Decentralized Weather Prediction Market

A blockchain-based platform enabling users to make and trade predictions on weather outcomes using oracle-verified weather data. The platform incentivizes accurate weather forecasting through a stake-based reward system.

## System Architecture

### Weather Data Contract
The foundation of the platform, responsible for:
- Integration with multiple weather data oracles
- Data validation and aggregation
- Real-time weather metrics storage
- Data point timestamping and verification
- Geographic location mapping
- Data quality assurance

### Prediction Contract
Manages the creation and tracking of weather predictions:
- User prediction submission and stake management
- Market creation for specific weather events
- Dynamic odds calculation
- Position tracking
- Automated market closure
- Stake pooling and management

### Settlement Contract
Handles the resolution of prediction markets:
- Winner determination logic
- Reward calculation and distribution
- Stake release mechanisms
- Oracle data verification
- Dispute handling
- Automated settlements

### Historical Analysis Contract
Provides analytical capabilities for platform data:
- Prediction accuracy tracking
- User performance metrics
- Market trend analysis
- Statistical modeling
- Historical weather pattern correlation
- Predictive modeling assistance

## Getting Started

### Prerequisites
```bash
Node.js >= 16.0.0
Hardhat
Web3 wallet (MetaMask recommended)
Chainlink node subscription
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/weather-prediction-market.git
cd weather-prediction-market
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Configure your environment variables:
# - ORACLE_API_KEYS
# - NETWORK_RPC_URL
# - PRIVATE_KEY
# - CHAINLINK_NODE_ADDRESS
```

4. Deploy contracts:
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## Usage Examples

### Creating a Weather Prediction Market

```solidity
await PredictionContract.createMarket({
    location: "New York",
    metric: "temperature",
    targetDate: "2025-03-01",
    predictionWindow: 86400, // 24 hours
    minimumStake: ethers.utils.parseEther("0.1")
});
```

### Submitting a Prediction

```solidity
await PredictionContract.submitPrediction({
    marketId: "market-123",
    prediction: 75, // temperature in Fahrenheit
    stake: ethers.utils.parseEther("0.5")
});
```

### Querying Historical Data

```solidity
const analysis = await HistoricalAnalysisContract.getMarketAnalysis({
    location: "New York",
    startDate: "2024-01-01",
    endDate: "2024-12-31"
});
```

## Smart Contract Integration

### Oracle Integration
```solidity
contract WeatherDataContract {
    using Chainlink for Chainlink.Request;
    
    function requestWeatherData(string location) external returns (bytes32) {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );
        request.add("location", location);
        return sendChainlinkRequestTo(oracle, request, fee);
    }
}
```

## Security Measures

- Oracle data verification through multiple sources
- Timelock mechanisms for critical operations
- Stake slashing for malicious behavior
- Emergency pause functionality
- Regular security audits
- Automated market closure failsafes

## Testing

Run the test suite:
```bash
npx hardhat test
```

Generate coverage report:
```bash
npx hardhat coverage
```

## API Documentation

### Weather Data Endpoints

```javascript
GET /api/v1/weather/current
GET /api/v1/weather/forecast
GET /api/v1/weather/historical
```

### Prediction Market Endpoints

```javascript
POST /api/v1/markets/create
GET /api/v1/markets/active
POST /api/v1/predictions/submit
```

## Tokenomics

- Platform Token: WPRCT
- Total Supply: 100,000,000
- Distribution:
    - Prediction Rewards: 40%
    - Oracle Incentives: 20%
    - Development: 20%
    - Community Growth: 20%

## Development Roadmap

### Phase 1 - Q2 2025
- Core contract deployment
- Basic prediction functionality
- Oracle integration

### Phase 2 - Q3 2025
- Advanced analytics
- Mobile app release
- Multi-chain support

### Phase 3 - Q4 2025
- DAO governance
- Automated market making
- AI-powered predictions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Submit a pull request

## License

MIT License - see [LICENSE.md](LICENSE.md)

## Support

- Technical Documentation: [docs.weatherprediction.market](https://docs.weatherprediction.market)
- Discord: [WeatherPrediction Community](https://discord.gg/weatherprediction)
- Email: support@weatherprediction.market

## Acknowledgments

- Chainlink for oracle services
- OpenZeppelin for smart contract libraries
- Weather data providers
