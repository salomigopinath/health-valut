const CONTRACT_ADDRESS = "";
const CONTRACT_ABI = [
    "function registerHospital(address _hospital, string memory _name) public",
    "function addRecord(address _patient, string memory _ipfsHash, string memory _doctor, uint256 _day, uint256 _month, uint256 _year) public",
    "function grantAccess(address _to) public",
    "function getRecordCount(address _patient) public view returns (uint256)",
    "function getRecord(address _patient, uint256 _id) public view returns (string memory, string memory, uint256, uint256, uint256, address)",
    "function getHospitalCount() public view returns (uint256)",
    "function hospitalAddresses(uint256 index) public view returns (address)",
    "function hospitals(address _addr) public view returns (string name, bool isRegistered)",
    "function owner() public view returns (address)",
    "function isHospital(address _addr) public view returns (bool)"
];
