# State Machine Model

流程穩定性用狀態機保護。

- 明確狀態：idle、running、success、failed
- 明確事件：start、retry、cancel、complete
- 錯誤與重試要可見
- UI 狀態不能取代 domain 狀態

重點是讓流程可追蹤、不失控、不爆炸。
