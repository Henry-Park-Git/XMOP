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
  const [keyPairNames, setKeyPairNames] = useState([]); // Key Pair 이름 목록을 저장할 상태
  const [selectedKeyPairName, setSelectedKeyPairName] = useState("");
  const [keyPairName, setKeyPairName] = useState(""); // 새로운 Key Pair 이름을 저장할 상태
  const [securityGroupOption, setSecurityGroupOption] = useState(""); // 보안 그룹 옵션을 저장할 상태 추가
  const [securityGroups, setSecurityGroups] = useState([]); // API 호출 결과를 저장할 상태
  const [selectedSecurityGroup, setSelectedSecurityGroup] = useState('');
  const [storageConfiguration, setStorageConfiguration] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지를 저장할 새로운 상태

  // 인스턴스 타입 목록을 추가
  const instanceTypes = ["t2.micro", "t2.medium", "t3.medium"];

  // AWS 지역 정보를 가져오는 useEffect
  useEffect(() => {
    fetch('http://localhost:3000/available_regions')
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
  
  // Key Pair 목록을 가져오는 useEffect
  useEffect(() => {
    if (keyPairOption === "selectExisting") {
      const url = `http://localhost:3000/key-pairs${awsRegion ? `?region=${awsRegion}` : ''}`;

      fetch(url)
        .then(response => response.json()) // 첫 번째 then에서 response.json() 호출
        .then(data => {
          if (data.error) { // 백엔드에서 오류 메시지가 반환된 경우
            setErrorMessage("You do not have permission to view key pairs in this region."); // 오류 메시지 설정
            setKeyPairNames([]); // keyPairNames를 빈 배열로 설정
          } else {
            setKeyPairNames(data.keyPairs); // 성공적인 응답 처리
            setErrorMessage(""); // 오류 메시지 초기화
          }
        })
        .catch(error => {
          console.error("Fetching key pairs failed:", error);
          setErrorMessage("An error occurred while fetching key pairs."); // catch 블록에서 오류 처리
        });
    }
  }, [keyPairOption, awsRegion]);

  // "Attach existing"이 선택되었을때 보안 그룹 목록을 가져옵니다.
  useEffect(() => {
    fetch('http://localhost:3000/security-groups')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setSecurityGroups(data))
      .catch(error => {
        console.error("Fetching security groups failed:", error);
      });
  }, []);
  
  const handleSecurityGroupChange = (event) => {
    setSelectedSecurityGroup(event.target.value);
  };
  
  

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
      
      {/* AMI 부분 */}
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

            {/* "Select existing" 옵션 선택 시 드롭다운 메뉴 표시 */}
            {
              keyPairOption === "selectExisting" && (
                <div>
                  <label className="form-label">
                    Key Pairs:
                    {Array.isArray(keyPairNames) && keyPairNames.length > 0 ? (
                      <select
                        value={selectedKeyPairName}
                        onChange={e => setSelectedKeyPairName(e.target.value)}
                        className="form-input"
                      >
                        {keyPairNames.map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    ) : (
                      <p>There are no key pairs available in this region.</p>
                    )}
                  </label>
                </div>
              )
            }

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
        <span>
          <input
            type="radio"
            value="attach existing"
            name="securityGroupOption"
            checked={securityGroupOption === "attach existing"}
            onChange={(e) => setSecurityGroupOption(e.target.value)}
          /> Attach existing
        </span>
        <span>
          <input
            type="radio"
            value="create new with rules"
            name="securityGroupOption"
            checked={securityGroupOption === "create new with rules"}
            onChange={(e) => setSecurityGroupOption(e.target.value)}
          /> Create new with rules
        </span>
      </label>
        {/* "Attach existing"이 선택되었을때 보안 그룹 목록을 표시 */}  
        {securityGroupOption === "attach existing" && (
          <div>
            <label className="form-label">
              Security Groups:
              <select value={selectedSecurityGroup} onChange={handleSecurityGroupChange} className="form-input">
                {securityGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </label>
          </div>
        )}

      <label className="form-label">
        Storage configuration:
        <input className="form-input" type="text" value={storageConfiguration} onChange={e => setStorageConfiguration(e.target.value)} />
      </label>
    </form>
  );
};

export default HighlyAvailableDeploymentForm;
