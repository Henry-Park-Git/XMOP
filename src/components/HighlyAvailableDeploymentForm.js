import React, { useEffect, useState } from 'react';

const HighlyAvailableDeploymentForm = () => {
  const [awsRegions, setAwsRegions] = useState([]);
  const [awsRegion, setAwsRegion] = useState("");
  const [minInstances, setMinInstances] = useState(1); 
  const [maxInstances, setMaxInstances] = useState(1);
  const [selectedAmiType, setSelectedAmiType] = useState(""); // 선택된 AMI 유형을 저장할 상태 (Linux 또는 Ubuntu)
  const [imageId, setImageId] = useState(""); // 사용자가 입력한 Image ID를 저장할 상태 추가
  const [instanceType, setInstanceType] = useState("");
  const [keyPairOption, setKeyPairOption] = useState(""); 
  const [keyPairName, setKeyPairName] = useState("");
  const [securityGroups, setSecurityGroups] = useState("");
  const [storageConfiguration, setStorageConfiguration] = useState("");
  // 인스턴스 타입 목록을 추가
  const instanceTypes = ["t2.micro", "t2.medium", "t3.medium"];

  // AWS 지역 정보를 가져오는 useEffect
  useEffect(() => {
    fetch('http://localhost:3000/api/available_regions')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setAwsRegions(data.available_regions))
      .catch(error => {
        console.error("Fetching AWS regions failed:", error);
      });
  }, []);
  


  return (
    <form className="deployment-form">
      <label className="form-label">
        AWS Region:
        <select value={awsRegion} onChange={e => setAwsRegion(e.target.value)} className="form-input">
          {awsRegions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </label>

      <label className="form-label">
        Minimum Number of Instances:
        <input 
          className="form-input" 
          type="number" 
          value={minInstances} 
          onChange={e => {
            const newMinInstances = Math.max(1, parseInt(e.target.value, 10));
            setMinInstances(newMinInstances);
          }} 
        />
      </label>

      <label className="form-label">
        Maximum Number of Instances:
        <input 
          className="form-input" 
          type="number" 
          value={maxInstances} 
          onChange={e => {
            const newMaxInstances = Math.max(minInstances, parseInt(e.target.value, 10));
            setMaxInstances(newMaxInstances);
          }} 
        />
      </label>
      
      {/* AMIs 렌더링하는 부분 */}
      <div>
        <label className="form-label">
        <span>AMI: </span>
          <input
            type="radio"
            name="amiType"
            value="Linux"
            checked={selectedAmiType === "Linux"}
            onChange={() => setSelectedAmiType("Linux")}
          />
          Linux
        </label>
        <label className="form-label">
          <input
            type="radio"
            name="amiType"
            value="Ubuntu"
            checked={selectedAmiType === "Ubuntu"}
            onChange={() => setSelectedAmiType("Ubuntu")}
          />
          Ubuntu
        </label>
      </div>

      <label className="form-label sub-label">
        Image ID:
        <input 
          className="form-input" 
          type="text" 
          value={imageId} 
          onChange={e => setImageId(e.target.value)} 
        />
      </label>

      <label className="form-label">
        Instance Type:
        <select 
          value={instanceType} 
          onChange={e => setInstanceType(e.target.value)} 
          className="form-input"
        >
          {instanceTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>

      <div>
        <span>Key pair:</span>
        <label className="form-label">
          <input
            type="radio"
            name="keyPairOption"
            value="selectExisting"
            checked={keyPairOption === "selectExisting"}
            onChange={() => setKeyPairOption("selectExisting")}
          />
          Select existing
        </label>
        
        <label className="form-label">
          <input
            type="radio"
            name="keyPairOption"
            value="createNew"
            checked={keyPairOption === "createNew"}
            onChange={() => setKeyPairOption("createNew")}
          />
          Create new
        </label>
        
        <label className="form-label">
          <input
            type="radio"
            name="keyPairOption"
            value="import"
            checked={keyPairOption === "import"}
            onChange={() => setKeyPairOption("import")}
          />
          Import
        </label>

        {/* 추가된 로직: "Create new"를 선택했을 때 Key Name 입력 필드를 보여줌 */}
        {keyPairOption === "createNew" && (
          <div> 
            <label className="form-label">
              Key Name:
              <input 
                className="form-input" 
                type="text" 
                value={keyPairName} 
                onChange={e => setKeyPairName(e.target.value)} 
              />
            </label>
          </div>
        )}
      </div>

      <label className="form-label">
        Security groups:
        <input className="form-input" type="text" value={securityGroups} onChange={e => setSecurityGroups(e.target.value)} />
      </label>
      <label className="form-label">
        Storage configuration:
        <input className="form-input" type="text" value={storageConfiguration} onChange={e => setStorageConfiguration(e.target.value)} />
      </label>
    </form>
  );
};

export default HighlyAvailableDeploymentForm;
