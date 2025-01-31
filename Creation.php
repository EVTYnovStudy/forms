<?php
// Activez l'affichage des erreurs pour le débogage
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Inclure la bibliothèque MongoDB (assurez-vous que le chemin est correct)
require 'vendor/autoload.php';

use MongoDB\Client;

// Connexion à MongoDB (remplacez par vos informations d'authentification)
$client = new Client("mongodb+srv://louiscolombel46:zApC5jCnbzcDJSpC@forms.lfhej.mongodb.net/");
$db = $client->google_forms_clone;
$formsCollection = $db->forms;
$questionsCollection = $db->questions;

// Vérifier si le formulaire a été soumis en POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Vérifier que les données nécessaires sont présentes dans $_POST
    if (isset($_POST['pollName']) && isset($_POST['questions'])) {
        // Récupérer les données du formulaire
        $pollName = $_POST['pollName'];
        $questions = $_POST['questions']; // Un tableau de questions envoyé depuis le formulaire

        // Générer un ID unique pour le formulaire
        $formId = uniqid("form_");

        // Sauvegarder le formulaire dans la collection "forms" de MongoDB
        $formDocument = [
            "id" => $formId,
            "title" => $pollName,
            "createdAt" => new \MongoDB\BSON\UTCDateTime() // Utilisation de la date UTC pour MongoDB
        ];

        // Insérer le formulaire dans la collection MongoDB
        try {
            $formsCollection->insertOne($formDocument);
        } catch (Exception $e) {
            echo "Erreur lors de l'insertion du formulaire : " . $e->getMessage();
            exit();
        }

        // Sauvegarder chaque question dans la collection "questions" de MongoDB
        foreach ($questions as $question) {
            $questionId = uniqid("question_");
            $questionDocument = [
                "_id" => $questionId,
                "formId" => $formId,
                "questionText" => $question['questionText'],
                "type" => $question['type'],
                "answers" => isset($question['answers']) ? $question['answers'] : [] // Si des réponses sont définies
            ];

            // Insérer chaque question dans la collection MongoDB
            try {
                $questionsCollection->insertOne($questionDocument);
            } catch (Exception $e) {
                echo "Erreur lors de l'insertion de la question : " . $e->getMessage();
                exit();
            }
        }

        // Message de succès après l'insertion des données
        echo "Sondage et questions enregistrés avec succès dans MongoDB !";
        echo '<br><a href="index.html">Retour à l\'accueil</a>';
    } else {
        // Si des données manquent, afficher un message d'erreur
        echo "Erreur: les données du formulaire sont incomplètes.";
    }
} else {
    // Si la requête n'est pas en POST, afficher un message d'erreur
    echo "Aucune donnée envoyée.";
}
?>

