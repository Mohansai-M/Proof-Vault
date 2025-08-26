// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ProofVault {
    struct Certificate {
        string ipfsHash;       // CID from IPFS
        string issuer;
        string receiver;
        uint256 timestamp;
    }

    mapping(string => Certificate) public certificates;

    event CertificateUploaded(
        string indexed ipfsHash,
        string issuer,
        string receiver,
        uint256 timestamp
    );

    function uploadCertificate(
        string memory ipfsHash,
        string memory issuer,
        string memory receiver
    ) external {
        require(certificates[ipfsHash].timestamp == 0, "Certificate already exists");
        certificates[ipfsHash] = Certificate(ipfsHash, issuer, receiver, block.timestamp);
        emit CertificateUploaded(ipfsHash, issuer, receiver, block.timestamp);
    }

    function verifyCertificate(string memory ipfsHash)
        external
        view
        returns (bool exists, string memory issuer, string memory receiver, uint256 timestamp)
    {
        Certificate memory cert = certificates[ipfsHash];
        if (cert.timestamp != 0) {
            return (true, cert.issuer, cert.receiver, cert.timestamp);
        } else {
            return (false, "", "", 0);
        }
    }
}
