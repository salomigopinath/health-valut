// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MedChain
 * @dev Decentralized Health Record Management System
 */
contract MedChain {
    address public owner;

    struct MedicalRecord {
        string ipfsHash;
        string doctorName;
        uint256 day;
        uint256 month;
        uint256 year;
        address hospital;
    }

    struct Hospital {
        string name;
        bool isRegistered;
    }

    mapping(address => Hospital) public hospitals;
    address[] public hospitalAddresses;
    mapping(address => MedicalRecord[]) private patientRecords;
    mapping(address => mapping(address => bool)) public hasAccess;

    event HospitalRegistered(address indexed hospital, string name);
    event RecordAdded(address indexed patient, address indexed hospital, string ipfsHash);
    event AccessGranted(address indexed patient, address indexed hospital);
    event AccessRevoked(address indexed patient, address indexed hospital);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyRegisteredHospital() {
        require(hospitals[msg.sender].isRegistered, "Only registered hospitals can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerHospital(address _hospital, string memory _name) public onlyOwner {
        require(!hospitals[_hospital].isRegistered, "Hospital already registered");
        hospitals[_hospital] = Hospital(_name, true);
        hospitalAddresses.push(_hospital);
        emit HospitalRegistered(_hospital, _name);
    }

    function getHospitalCount() public view returns (uint256) {
        return hospitalAddresses.length;
    }

    function addRecord(
        address _patient, 
        string memory _ipfsHash, 
        string memory _doctor, 
        uint256 _day, 
        uint256 _month, 
        uint256 _year
    ) public onlyRegisteredHospital {
        patientRecords[_patient].push(MedicalRecord({
            ipfsHash: _ipfsHash,
            doctorName: _doctor,
            day: _day,
            month: _month,
            year: _year,
            hospital: msg.sender
        }));
        emit RecordAdded(_patient, msg.sender, _ipfsHash);
    }

    function grantAccess(address _hospital) public {
        hasAccess[msg.sender][_hospital] = true;
        emit AccessGranted(msg.sender, _hospital);
    }

    function revokeAccess(address _hospital) public {
        hasAccess[msg.sender][_hospital] = false;
        emit AccessRevoked(msg.sender, _hospital);
    }

    function getRecordCount(address _patient) public view returns (uint256) {
        require(msg.sender == _patient || hasAccess[_patient][msg.sender] || msg.sender == owner, "Access denied");
        return patientRecords[_patient].length;
    }

    function getRecord(address _patient, uint256 _index) public view returns (
        string memory ipfsHash,
        string memory doctorName,
        uint256 day,
        uint256 month,
        uint256 year,
        address hospital
    ) {
        require(msg.sender == _patient || hasAccess[_patient][msg.sender] || msg.sender == owner, "Access denied");
        MedicalRecord storage record = patientRecords[_patient][_index];
        return (
            record.ipfsHash,
            record.doctorName,
            record.day,
            record.month,
            record.year,
            record.hospital
        );
    }

    function isHospital(address _addr) public view returns (bool) {
        return hospitals[_addr].isRegistered;
    }
}
