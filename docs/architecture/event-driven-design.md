# Event-Driven Design

資料流以事件為主線：

1. 入口收到請求
2. use case 執行業務流程
3. domain 產生事件
4. 下游模組訂閱並處理

事件描述的是「已發生的事實」，不是命令。
