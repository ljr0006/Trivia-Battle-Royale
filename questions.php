<?php
//index.php

$error = '';
$question = '';
$correct_answer = '';
$wrong_answer_1 = '';
$wrong_answer_2 = '';
$wrong_answer_3 = '';

function clean_text($string)
{
    $string = trim($string);
    $string = stripslashes($string);
    $string = htmlspecialchars($string);
    $string = str_replace('"', '', $string);
    return $string;
}

if (isset($_POST["submit"])) {
    if (empty($_POST["question"])) {
        $error .= '<p><label class="text-danger">Please Enter Question</label></p>';
    } else {
        $question = clean_text($_POST["question"]);
    }
    if (empty($_POST["correct_answer"])) {
        $error .= '<p><label class="text-danger">Please Enter the Correct Answer</label></p>';
    } else {
        $correct_answer = clean_text($_POST["correct_answer"]);
    }
    if (empty($_POST["wrong_answer_1"])) {
        $error .= '<p><label class="text-danger">Correct Answer is required</label></p>';
    } else {
        $wrong_answer_1 = clean_text($_POST["wrong_answer_1"]);
    }
    if (empty($_POST["wrong_answer_2"])) {
        $error .= '<p><label class="text-danger">Wrong Answer 2 is required</label></p>';
    } else {
        $wrong_answer_2 = clean_text($_POST["wrong_answer_2"]);
    }
    if (empty($_POST["wrong_answer_3"])) {
        $error .= '<p><label class="text-danger">Wrong Answer 3 is required</label></p>';
    } else {
        $wrong_answer_3 = clean_text($_POST["wrong_answer_3"]);
    }

    if ($error == '') {
        $file_open = fopen("questions/pending_questions.csv", "a");
        $no_rows = count(file("questions/pending_questions.csv"));
        if ($no_rows > 1) {
            $no_rows = ($no_rows - 1) + 1;
        }
        $form_data = array(
            'sr_no'  => $no_rows,
            'question'  => $question,
            'correct_answer'  => $correct_answer,
            'wrong_answer_1' => $wrong_answer_1,
            'wrong_answer_2' => $wrong_answer_2,
            'wrong_answer_3' => $wrong_answer_3
        );
        fputcsv($file_open, $form_data);
        $error = '<label class="text-success">Your question has been submitted for review</label>';
        $question = '';
        $correct_answer = '';
        $wrong_answer_1 = '';
        $wrong_answer_2 = '';
        $wrong_answer_3 = '';
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Add Questions</title>
    <!-- bootstrap 5 css -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous" />
    <!-- BOOTSTRAP ICONS CSS-->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css">
    <!-- custom css -->
    <link rel="stylesheet" href="css/styles.css" />
</head>

<body>
    <!-- Side-Nav -->
    <div class="side-navbar active-nav d-flex justify-content-between flex-wrap flex-column" id="sidebar" style="font-family: fortnite, sans-serif; font-size: xx-large">
        <ul class="nav flex-column text-white w-100">
            <p class="h3 text-white my-4" style="text-align: center">
                T B R
            </p>
            <li href="index.html" class="nav-link">
                <i class="bi bi-house-fill"></i>
                <span class="mx-2">Home</span>
            </li>
            <li href="questions.php" class="nav-link">
                <i class="bi bi-clipboard2-plus"></i>
                <span class="mx-2">Add Questions</span>
            </li>
        </ul>

    </div>

    <!-- Main Wrapper For Adding Questions -->
    <div class="active-cont">

        <head>
            <title>Add Questions</title>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        </head>

        <body style="background-color:#90a4ae; color: #fff;">
            <div class="container" style="font-family: fortnite, sans-serif; font-size: xx-large;">
                <h2 align="center">Enter Your Own Question</h2>
                <div class="col-md-12" style="margin:0 auto; float:none;">
                    <form method="post">
                        <br />
                        <?php echo $error; ?>
                        <div class="form-group">
                            <label>Enter Question</label>
                            <input type="text" style="font-size: x-large;" name="question" placeholder="Enter Question" class="form-control" value="<?php echo $question; ?>" />
                        </div>
                        <div class="form-group">
                            <label>Enter Correct Answer</label>
                            <input type="text" style="font-size: x-large;" name="correct_answer" class="form-control" placeholder="Enter Correct Answer" value="<?php echo $correct_answer; ?>" />
                        </div>
                        <div class="form-group">
                            <label>Enter Wrong Answer 1</label>
                            <input type="text" style="font-size: x-large;" name="wrong_answer_1" class="form-control" placeholder="Enter Wrong Answer 1" value="<?php echo $wrong_answer_1; ?>" />
                        </div>
                        <div class="form-group">
                            <label>Enter Wrong Answer 2</label>
                            <input type="text" style="font-size: x-large;" name="wrong_answer_2" class="form-control" placeholder="Enter Wrong Answer 2" value="<?php echo $wrong_answer_2; ?>" />
                        </div>
                        <div class="form-group">
                            <label>Enter Wrong Answer 3</label>
                            <input type="text" style="font-size: x-large;" name="wrong_answer_3" class="form-control" placeholder="Enter Wrong Answer 3" value="<?php echo $wrong_answer_1; ?>" />
                        </div>
                        <div class="form-group" align="center">
                            <input type="submit" name="submit" class="btn btn-info" style="background-color: #f4b400;" value="Submit" />
                        </div>
                    </form>
                </div>
            </div>
        </body>

    </div>

    <!-- bootstrap js -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
    <!-- custom js -->
    <script>
        var sidebar = document.querySelector("#sidebar");
        var container = document.querySelector(".my-container");
    </script>
</body>

</html>