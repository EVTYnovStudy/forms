<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pollName = $_POST['pollName'];
    $questions = $_POST['questions'];

    // Validation du nom unique (ajouter une vérification si plusieurs sondages sont sauvegardés)
    $filePath = 'polls.json';
    $polls = file_exists($filePath) ? json_decode(file_get_contents($filePath), true) : [];

    foreach ($polls as $poll) {
        if ($poll['pollName'] === $pollName) {
            die("Un sondage avec ce nom existe déjà !");
        }
    }

    // Sauvegarder le sondage
    $polls[] = ['pollName' => $pollName, 'questions' => $questions];
    file_put_contents($filePath, json_encode($polls, JSON_PRETTY_PRINT));

    echo "Sondage '$pollName' enregistré avec succès !";
    echo '<br><a href="index.html">Créer un autre sondage</a>';
}
?>
