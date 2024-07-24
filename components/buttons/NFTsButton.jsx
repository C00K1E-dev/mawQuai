import React, { useState, useEffect } from "react";
import PopupMessageNFT from "../PopupMessageNFT";
import { readContract } from "wagmi/actions";
import { useAccount } from 'wagmi';
import { abi1, NFT_CONTRACT_ADDRESS1 } from "../contracts/1stCollection";

const abi = abi1;
const contractAddress = NFT_CONTRACT_ADDRESS1;
const baseIpfsUrl = "https://silver-elegant-aphid-155.mypinata.cloud/ipfs/QmcjALMQb2m9uVCGPECJTMhCmFx4J5D6piiCdyUadSoDYU/";

const NFTsButton = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [nftsData, setNftsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();

  const nftContract = {
    address: contractAddress,
    abi: abi,
  };

  useEffect(() => {
    // Create the display content for the popup message
    if (nftsData.length > 0 && showPopup) {
      const nftsDisplay = nftsData.map((nft) => {
        // Construct the display content for each NFT
        return (
          <div key={nft.tokenId}>
            <p>Collection Name: {nft.collectionName}</p>
            <p>Token ID: {nft.tokenId.toString()}</p>
            <video controls width="320" height="240">
              <source src={nft.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      });

      // Show the popup with the NFTs data
      setPopupMessage(nftsDisplay);
    }
  }, [nftsData, showPopup]);

  const fetchNFTData = async () => {
    try {
      console.log("Inside fetchNFTData");

      // Fetch contract data
      const [name, symbol, ownedTokenIdsData] = await Promise.all([
        readContract({
          ...nftContract,
          functionName: 'name',
        }),
        readContract({
          ...nftContract,
          functionName: 'symbol',
        }),
        readContract({
          ...nftContract,
          functionName: 'getOwnedTokenIds',
          args: [address],
        }),
      ]);

      console.log("Contract Data:", { name, symbol, ownedTokenIdsData });
      console.log("Owned Token IDs Data:", ownedTokenIdsData);

      // Ensure ownedTokenIdsData is an array
      if (!Array.isArray(ownedTokenIdsData)) {
        throw new Error("Owned Token IDs data is not an array.");
      }

      if (ownedTokenIdsData.length === 0) {
        // User doesn't own any NFTs
        setPopupMessage("You don't own any NFTs!");
        setShowPopup(true);
        setLoading(false);
        return;
      }

      const nfts = [];
      ownedTokenIdsData.forEach((tokenId) => {
        const videoUrl = `${baseIpfsUrl}${tokenId}.mp4`;
        nfts.push({
          tokenId: tokenId,
          videoUrl: videoUrl,
          collectionName: name,
        });
      });

      console.log("NFTs:", nfts);

      setNftsData(nfts);
      setLoading(false);
      setShowPopup(true); // Show popup after data is fetched
    } catch (error) {
      console.error("Error fetching NFT data:", error);
      setPopupMessage("An error occurred while fetching your NFTs.");
      setShowPopup(true);
      setLoading(false);
    }
  };

  const handleButtonClick = async () => {
    if (!address) {
      setPopupMessage("Please connect your wallet first.");
      setShowPopup(true);
      return;
    }

    setLoading(true);
    await fetchNFTData();
  };

  return (
    <div>
      {isConnected && (
        <button className="btn btn--primary" onClick={handleButtonClick}>
          View Your NFTs
        </button>
      )}

      {showPopup && (
        <PopupMessageNFT message={popupMessage} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default NFTsButton;
