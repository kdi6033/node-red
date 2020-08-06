
<img src="http://c.doowon.ac.kr/image/i2r_small.png" width="450px" height="300px" title="px(픽셀) 크기 설정" alt="RubberDuck"></img><br/>
![Alt text](/i2r_small.png)

## 4. 세탁기 만들기
작업을 구성 했으므로 장치를 추가하고 데이터를 보낼 수 있습니다. 클라우드 서비스는 다음 의도를 처리해야합니다.

보조자가 사용자가 연결 한 장치를 알고 자 할 때 SYNC 의도가 발생합니다. 사용자가 계정을 연결하면 서비스로 전송됩니다. 모든 사용자 장치 및 해당 기능의 JSON 페이로드로 응답해야합니다.
QUERY 의도는 보조자가 장치의 현재 상태 또는 상태를 알고 자 할 때 발생합니다. 요청 된 각 장치의 상태가있는 JSON 페이로드로 응답해야합니다.
보조자가 사용자를 대신하여 장치를 제어하려고 할 때 EXECUTE 의도가 발생합니다. 요청 된 각 장치의 실행 상태가있는 JSON 페이로드로 응답해야합니다.
사용자가 보조자와 계정의 연결을 해제하면 DISCONNECT 의도가 발생합니다. 이 사용자의 장치에 대한 이벤트 전송을 Assistant로 중지해야합니다.
다음 섹션에서 이러한 의도를 처리하기 위해 이전에 배포 한 기능을 업데이트합니다.

SYNC 응답 업데이트
Assistant의 요청에 응답하는 코드가 포함 된 functions / index.js를 엽니 다.

장치 메타 데이터 및 기능을 반환하여 SYNC 의도를 처리해야합니다. 옷 세척기에 대한 장치 정보 및 권장 특성을 포함하도록 onSync 배열에서 JSON을 업데이트하십시오.

index.js
```
app.onSync((body) => {
  return {
    requestId: body.requestId,
    payload: {
      agentUserId: USER_ID,
      devices: [{
        id: 'washer',
        type: 'action.devices.types.WASHER',
        traits: [
          'action.devices.traits.OnOff',
          'action.devices.traits.StartStop',
          'action.devices.traits.RunCycle',
        ],
        name: {
          defaultNames: ['My Washer'],
          name: 'Washer',
          nicknames: ['Washer'],
        },
        deviceInfo: {
          manufacturer: 'Acme Co',
          model: 'acme-washer',
          hwVersion: '1.0',
          swVersion: '1.0.1',
        },
        willReportState: true,
        attributes: {
          pausable: true,
        },
      }],
    },
  };
});
```

Firebase에 배포
Firebase CLI를 사용하여 업데이트 된 클라우드 이행을 배포하십시오.

firebase deploy —only functions

Google Assistant에 연결
스마트 홈 액션을 테스트하려면 프로젝트를 Google 계정과 연결해야합니다. 이를 통해 동일한 계정으로 로그인 한 Google Assistant Surface 및 Google Home 앱을 통해 테스트 할 수 있습니다.

중요 :이 코드 랩에는 사용자 자격 증명을 실제로 확인하지 않는 계정 연결 구현이 포함되어 있습니다. 프로덕션 시스템에서는 장치를 안전하게 유지하기 위해 OAuth 2.0 프로토콜을 구현해야합니다.

휴대 전화에서 Google 어시스턴트 설정을 엽니 다. 콘솔에서와 동일한 계정으로 로그인해야합니다.
Google 어시스턴트> 설정> 홈 컨트롤 (어시스턴트 아래)로 이동하십시오.
오른쪽 하단에서 더하기 (+) 아이콘을 선택하십시오.
[test] 접두사와 설정 한 표시 이름이있는 테스트 앱이 표시됩니다.
해당 항목을 선택하십시오. 그러면 Google 어시스턴트가 서비스를 인증하고 SYNC 요청을 보내 서비스가 사용자에게 기기 목록을 제공하도록 요청합니다.
Google Home 앱을 열고 세탁기가 보이는지 확인합니다.



##5. 명령 및 쿼리 처리
클라우드 서비스가 세탁기 장치를 Google에 올바르게보고하므로 장치 상태를 요청하고 명령을 보내는 기능을 추가해야합니다.

QUERY 인 텐트 처리
QUERY 인 텐트에는 일련의 장치가 포함됩니다. 각 장치마다 현재 상태로 응답해야합니다.

functions / index.js에서 QUERY 핸들러를 편집하여 의도 요청에 포함 된 대상 장치 목록을 처리하십시오.

index.js
```
app.onQuery(async (body) => {
  const {requestId} = body;
  const payload = {
    devices: {},
  };
  const queryPromises = [];
  const intent = body.inputs[0];
  for (const device of intent.payload.devices) {
    const deviceId = device.id;
    queryPromises.push(queryDevice(deviceId)
        .then((data) => {
        // Add response to device payload
          payload.devices[deviceId] = data;
        }
        ));
  }
  // Wait for all promises to resolve
  await Promise.all(queryPromises);
  return {
    requestId: requestId,
    payload: payload,
  };
});
```

요청에 포함 된 각 장치에 대해 실시간 데이터베이스에 저장된 현재 상태를 반환하십시오. 와셔의 상태 데이터를 리턴하도록 queryFirebase 및 queryDevice 함수를 업데이트하십시오.

index.js
```
const queryFirebase = async (deviceId) => {
  const snapshot = await firebaseRef.child(deviceId).once('value');
  const snapshotVal = snapshot.val();
  return {
    on: snapshotVal.OnOff.on,
    isPaused: snapshotVal.StartStop.isPaused,
    isRunning: snapshotVal.StartStop.isRunning,
  };
};

const queryDevice = async (deviceId) => {
  const data = await queryFirebase(deviceId);
  return {
    on: data.on,
    isPaused: data.isPaused,
    isRunning: data.isRunning,
    currentRunCycle: [{
      currentCycle: 'rinse',
      nextCycle: 'spin',
      lang: 'en',
    }],
    currentTotalRemainingTime: 1212,
    currentCycleRemainingTime: 301,
  };
};
```

EXECUTE 의도 처리
EXECUTE 의도는 장치 상태를 업데이트하는 명령을 처리합니다. 응답은 각 명령의 상태 (예 : SUCCESS, ERROR 또는 PENDING)와 새 장치 상태를 반환합니다.

functions / index.js에서 EXECUTE 핸들러를 편집하여 업데이트가 필요한 특성 목록 및 각 명령에 대한 대상 장치 세트를 처리하십시오.

index.js
```
app.onExecute(async (body) => {
  const {requestId} = body;
  // Execution results are grouped by status
  const result = {
    ids: [],
    status: 'SUCCESS',
    states: {
      online: true,
    },
  };

  const executePromises = [];
  const intent = body.inputs[0];
  for (const command of intent.payload.commands) {
    for (const device of command.devices) {
      for (const execution of command.execution) {
        executePromises.push(
            updateDevice(execution, device.id)
                .then((data) => {
                  result.ids.push(device.id);
                  Object.assign(result.states, data);
                })
                .catch(() => functions.logger.error('EXECUTE', device.id)));
      }
    }
  }

  await Promise.all(executePromises);
  return {
    requestId: requestId,
    payload: {
      commands: [result],
    },
  };
});
```

각 명령 및 대상 장치에 대해 요청 된 특성에 해당하는 실시간 데이터베이스의 값을 업데이트하십시오. 적절한 Firebase 참조를 업데이트하고 업데이트 된 기기 상태를 반환하도록 updateDevice 기능을 수정하십시오.

index.js
```
const updateDevice = async (execution, deviceId) => {
  const {params, command} = execution;
  let state; let ref;
  switch (command) {
    case 'action.devices.commands.OnOff':
      state = {on: params.on};
      ref = firebaseRef.child(deviceId).child('OnOff');
      break;
    case 'action.devices.commands.StartStop':
      state = {isRunning: params.start};
      ref = firebaseRef.child(deviceId).child('StartStop');
      break;
    case 'action.devices.commands.PauseUnpause':
      state = {isPaused: params.pause};
      ref = firebaseRef.child(deviceId).child('StartStop');
      break;
  }

  return ref.update(state)
      .then(() => state);
};
```
6. Test your Action