// 모던 브라우저 감지
const isModern = 'fetch' in window && 'assign' in Object

// 모던 브라우저가 아닌 경우
if (!isModern) {
  // 동적으로 <script> 요소 생성
  const scriptNode = document.createElement('script')
  // <script> 요소 속성 설정
  scriptNode.async = false
  scriptNode.src = './polyfills.js'
  // <head> 요소 안쪽 뒤에 삽입 (로딩)
  document.head.appendChild(scriptNode)
}