import * as DICTIONARY from 'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/SavedModels/spam/dictionary.js';




const POST_COMMENT_BTN = document.getElementById('post');

const COMMENT_TEXT = document.getElementById('comment');

const COMMENTS_LIST = document.getElementById('commentsList');
const currentUserName = 'Anonymous'
// CSS styling class to indicate comment is being processed when

// posting to provide visual feedback to users.

const PROCESSING_CLASS = 'processing';


const MODEL_JSON_URL = 'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/SavedModels/spam/model.json';

const SPAM_THRESHOLD = 0.5;

var model = undefined;
/** 

 * Function to handle the processing of submitted comments.

 **/

 function handleCommentPost() {

    // Only continue if you are not already processing the comment.
  
    if (! POST_COMMENT_BTN.classList.contains(PROCESSING_CLASS)) {
  
      POST_COMMENT_BTN.classList.add(PROCESSING_CLASS);
  
      COMMENT_TEXT.classList.add(PROCESSING_CLASS);
  
      let currentComment = COMMENT_TEXT.innerText;
  
      let lowercaseSentenceArray = currentComment.toLowerCase().replace(/[^\w\s]/g, '').split(' ');


      let li = document.createElement('li');
      
      let p = document.createElement('p');
      
      p.innerText = COMMENT_TEXT.innerText;
      
      let spanName = document.createElement('span');
      
      spanName.setAttribute('class', 'username');
      
      spanName.innerText = currentUserName;
      
      let spanDate = document.createElement('span');
      
      spanDate.setAttribute('class', 'timestamp');
      
      let curDate = new Date();
      
      spanDate.innerText = curDate.toLocaleString();
      
      li.appendChild(spanName);
      
      li.appendChild(spanDate);
      
      li.appendChild(p);
      
      COMMENTS_LIST.prepend(li);
      
      COMMENT_TEXT.innerText = '';
      
      
      loadAndPredict(tokenize(lowercaseSentenceArray), li).then(function() {
      
        POST_COMMENT_BTN.classList.remove(PROCESSING_CLASS);
      
        COMMENT_TEXT.classList.remove(PROCESSING_CLASS);
      
      });  
      
  
      // TODO: Fill out the rest of this function later.
  
    }
  
  }
  
  
  POST_COMMENT_BTN.addEventListener('click', handleCommentPost);

  async function loadAndPredict(inputTensor, domComment) {

    // Load the model.json and binary files you hosted. Note this is 
  
    // an asynchronous operation so you use the await keyword
  
  
      model = await tf.loadLayersModel(MODEL_JSON_URL);
  
  
    
  
    // Once model has loaded you can call model.predict and pass to it
  
    // an input in the form of a Tensor. You can then store the result.
  
    var results = await model.predict(inputTensor);

  
    
  
    // Print the result to the console for us to inspect.
  
    results.print();
    let dataArray = results.dataSync();

  if (dataArray[1] > SPAM_THRESHOLD) {

    domComment.classList.add('spam');

  }
    
  else {

    // Emit socket.io comment event for server to handle containing

    // all the comment data you would need to render the comment on

    // a remote client's front end.

    socket.emit('comment', {

      username: currentUserName,

      timestamp: domComment?.querySelectorAll('span')[1].innerText,

      comment: domComment?.querySelectorAll('p')[0].innerText

    });

  }
    // TODO: Add extra logic here later to do something useful
  
  }
  
  const ENCODING_LENGTH = 20;



  function tokenize(wordArray) {
  
    let returnArray = [DICTIONARY.START];
  
    
  
    for (var i = 0; i < wordArray.length; i++) {
  
      let encoding = DICTIONARY.LOOKUP[wordArray[i]];
  
      returnArray.push(encoding === undefined ? DICTIONARY.UNKNOWN : encoding);
  
    }
  
  
    while (returnArray.length < ENCODING_LENGTH) {
  
      returnArray.push(DICTIONARY.PAD);
  
    }
  
    
  
  
  
    return tf.tensor2d([returnArray]);
  
  }
  


  const socket = io.connect('http://jefferys-imac:3000')



function handleRemoteComments(data) {

  let li = document.createElement('li');

  let p = document.createElement('p');

  p.innerText = data.comment;

  let spanName = document.createElement('span');

  spanName.setAttribute('class', 'username');

  spanName.innerText = data.username;


  let spanDate = document.createElement('span');

  spanDate.setAttribute('class', 'timestamp');

  spanDate.innerText = data.timestamp;


  li.appendChild(spanName);

  li.appendChild(spanDate);

  li.appendChild(p);

  

  COMMENTS_LIST.prepend(li);

}


socket.on('remoteComment', handleRemoteComments);

