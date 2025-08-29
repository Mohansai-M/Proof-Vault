// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ProofVault {
    struct Certificate {
        string ipfsHash;
        string issuer;
        string receiver;
        uint256 timestamp;
        bool revoked;
    }

    mapping(string => Certificate) private certificates;
    string[] private certificateList;

    event CertificateUploaded(
        bytes32 indexed ipfsHashHash, // indexed keccak256
        string ipfsHash,
        string issuer,
        string receiver,
        uint256 timestamp
    );

    event CertificateRevoked(
        bytes32 indexed ipfsHashHash,
        string ipfsHash,
        string issuer,
        uint256 timestamp
    );

    function uploadCertificate(
        string memory ipfsHash,
        string memory issuer,
        string memory receiver
    ) external {
        require(certificates[ipfsHash].timestamp == 0, "Certificate already exists");
        certificates[ipfsHash] = Certificate(ipfsHash, issuer, receiver, block.timestamp, false);
        certificateList.push(ipfsHash);

        emit CertificateUploaded(
            keccak256(abi.encodePacked(ipfsHash)),
            ipfsHash,
            issuer,
            receiver,
            block.timestamp
        );
    }

    function verifyCertificate(string memory ipfsHash)
        external
        view
        returns (
            bool exists,
            string memory issuer,
            string memory receiver,
            uint256 timestamp,
            bool revoked
        )
    {
        Certificate memory cert = certificates[ipfsHash];
        if (cert.timestamp != 0) {
            return (true, cert.issuer, cert.receiver, cert.timestamp, cert.revoked);
        } else {
            return (false, "", "", 0, false);
        }
    }

    function revokeCertificate(string memory ipfsHash) external {
        require(certificates[ipfsHash].timestamp != 0, "Certificate does not exist");
        certificates[ipfsHash].revoked = true;

        emit CertificateRevoked(
            keccak256(abi.encodePacked(ipfsHash)),
            ipfsHash,
            certificates[ipfsHash].issuer,
            block.timestamp
        );
    }

    function getAllCertificates() external view returns (Certificate[] memory) {
        Certificate[] memory allCerts = new Certificate[](certificateList.length);
        for (uint256 i = 0; i < certificateList.length; i++) {
            allCerts[i] = certificates[certificateList[i]];
        }
        return allCerts;
    }
}
