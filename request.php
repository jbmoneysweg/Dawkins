<?php

$name = $_POST['name'];
$email = $_POST['email'];
$job = $_POST['job'];
$message = "Email ".$email."    Company Name: ".$name."    Requested Companies: ".$job;

function
filter_email_header($form_field) {
    return
    preg_replace('/[nr|!/$%*&]+/',' ',$form_field);
}

$email = filter_email_header($email);

$headers = "From: $email";
$sent = mail('dawkinspgh@gmail.com', 'MobileApp Form Submission', $message, $name);

if ($sent) {
    ?><html>
            <head>
                <title>Thank You</title>
            </head>
            <body>
                <h1>Thank You,</h1>
                <p>We will be emailing you shortly </p>
                <br>
                 <a href="http://dawkinspgh.com/dashboard.html" class="g">Back to Sign in</a>
                 <br>
                 <a href="http://dawkinspgh.com" class="g">Back to Homepage</a>
            </body>
        </html>
    <?php

} else {
    ?><html>
            <head>
                <title>Thank You</title>
            </head>
            <body>
                <h1>Thank You,</h1>
                <p>We will be emailing you shortly.</p>
                <br>
                <a href="http://dawkinspgh.com/index.html" class="g">Back to Sign in</a>
                <br>
                 <a href="http://dawkinspgh.com" class="g">Back to Homepage</a>
            </body>
        </html>
    <?php
}
?>
