// Check if WebXR is supported by the browser
if ('xr' in navigator) {
    init();
  } else {
    console.error('WebXR not supported by this browser.');
  }
  
  async function init() {
    try {
      // Request AR session
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test']
      });
  
      // Create a reference space
      const referenceSpace = await session.requestReferenceSpace('local');
  
      // Create an XRHitTestSource to detect surfaces
      const hitTestSource = await session.requestHitTestSource({
        space: referenceSpace,
        offsetRay: new XRRay({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: -1 })
      });
  
      // Get the canvas element
      const canvas = document.getElementById('ar-overlay');
      const context = canvas.getContext('2d');
  
      // Start rendering loop
      session.requestAnimationFrame(drawFrame);
  
      function drawFrame(time, frame) {
        const hitTestResults = frame.getHitTestResults(hitTestSource);
  
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
  
        // Draw hit test results
        for (const hit of hitTestResults) {
          drawPoint(hit.transform.matrix, context);
        }
  
        // Request next animation frame
        session.requestAnimationFrame(drawFrame);
      }
  
      function drawPoint(matrix, context) {
        const x = matrix[12];
        const y = matrix[13];
        const radius = 5;
  
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = 'red';
        context.fill();
      }
    } catch (error) {
      console.error('Error initializing AR session:', error);
    }
  }
  