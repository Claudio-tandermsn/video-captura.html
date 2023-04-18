const startSharing = document.getElementById('startSharing');
    const videoScreen = document.getElementById('screenVideoShare');

   let mediaRecorder;
    let recorderdChunks = [];

        startSharing.addEventListener('click',async ()=>{
            try {
                const screenStream = await navigator.mediaDevices.getUserMedia({
                   video: {
                    cursor:'alwais'
                   },
                    audio:false 
                });

                const audioStream = await navigator.mediaDevices.getUserMedia({
                    audio: true
                })

                    const combinedStreams = new MediaStream([
                    ...screenStream.getVideoTracks(),
                    ...audioStream.getAudioTracks()
                ]);

                videoScreen.srcObject = combinedStreams;

                videoScreen.onloadedmetadata = () =>{
                    videoScreen.play();
                }

                combinedStreams.getVideoTracks()[0].onended = ()=>{
                  stopSharing();  
                }

                startRecording();
                
            }catch(error){
                    console.log("O seguinte erro ocorreu: "+error);
             }
        })

         function startRecording (MediaStream){
            mediaRecorder = new mediaRecorder(MediaStream,{MimeType:"video/webm"});
         }

        // mediaRecorder.ondataavailable = (event) => {
            console.log(event.data);
            console.log(event.data.size);
            recorderdChunks.push(event.data);
            //console.log(event.data);
        // }

        mediaRecorder.start();

        mediaRecorder.onstop = () => {
            downloadVideo();
        }
       
        // let interval= setInterval(function(){
           //mediaRecorder.request.Data();
      //  },500);

      function stopSharing(){
        if(videoScreen.srcObject){
            videoScreen.srcObject.getTracks().forEach(track=> track.stop()) 
           videoScreen.srcObject = null;   
            }
       if(mediaRecorder){
        mediaRecorder.stop();
       }
        }
    
        function downloadVideo(){
        const blob = new Blob(recorderdChunks, { type: "video/webm"});
        const url = Url.createObjectURL(blob);
        }  
        //link teste destruir//
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display ="none";
            a.href = url;
            a.download = "video=navegador.mp4";
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a)