<?php
require 'vendor/autoload.php'; // Charge les dépendances installées via Composer

use MongoDB\Client;

// Connexion à MongoDB Atlas
$client = new Client("mongodb+srv://louiscolombel46:zApC5jCnbzcDJSpC@forms.lfhej.mongodb.net/");

// Sélectionne la base de données et les collections
$database = $client->selectDatabase("forms");
$formCollection = $database->selectCollection("form");
$responsesCollection = $database->selectCollection("responses");

// Vérifier la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Vérifier si c'est un sondage ou une réponse
    if (!empty($_POST['pollName']) && !empty($_POST['questions'])) {
        // 🚀 Enregistrement d'un **sondage**
        $pollName = $_POST['pollName'];
        $questions = json_decode($_POST['questions'], true);

        if (!is_array($questions)) {
            echo "Erreur: les questions ne sont pas valides.";
            exit;
        }

        // Création du document à insérer
        $document = [
            'pollName' => $pollName,
            'questions' => $questions,
            'createdAt' => new MongoDB\BSON\UTCDateTime(),
        ];

        try {
            $result = $formCollection->insertOne($document);
            if ($result->getInsertedCount() === 1) {
                echo json_encode([
                    "success" => true,
                    "message" => "Sondage ajouté avec succès !",
                    "formId" => (string)$result->getInsertedId()
                ]);
            } else {
                echo json_encode(["success" => false, "message" => "Erreur lors de l'insertion du sondage."]);
            }
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => "Erreur MongoDB: " . $e->getMessage()]);
        }

    } elseif (!empty($_POST['formId']) && !empty($_POST['answers'])) {
        // 📝 Enregistrement des **réponses**
        $formId = $_POST['formId'];
        $answers = json_decode($_POST['answers'], true);

        if (!is_array($answers)) {
            echo json_encode(["success" => false, "message" => "Les réponses ne sont pas valides."]);
            exit;
        }

        $document = [
            'formId' => $formId,
            'answers' => $answers,
            'submittedAt' => new MongoDB\BSON\UTCDateTime(),
        ];

        try {
            $result = $responsesCollection->insertOne($document);
            if ($result->getInsertedCount() === 1) {
                echo json_encode(["success" => true, "message" => "Réponses enregistrées avec succès !"]);
            } else {
                echo json_encode(["success" => false, "message" => "Erreur lors de l'enregistrement des réponses."]);
            }
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => "Erreur MongoDB: " . $e->getMessage()]);
        }

    } else {
        echo json_encode(["success" => false, "message" => "Données invalides."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Méthode HTTP non supportée."]);
}
?>
