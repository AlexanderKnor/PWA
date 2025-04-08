// DOM Elemente
const actionButton = document.getElementById('action-button');
const messageOutput = document.getElementById('message-output');
const installButton = document.getElementById('install-button');

// Nachrichten für die Anzeige
const messages = [
    'Hallo! Schön, dass Sie diese PWA testen.',
    'PWAs bieten ein App-ähnliches Erlebnis im Browser.',
    'Diese App funktioniert auch offline!',
    'Sie können diese App auf Ihrem Startbildschirm installieren.',
    'Danke für Ihren Besuch!'
];

// Zufällige Nachricht anzeigen
actionButton.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    messageOutput.textContent = messages[randomIndex];

    // Animation hinzufügen
    messageOutput.style.opacity = '0';
    setTimeout(() => {
        messageOutput.style.opacity = '1';
    }, 100);
});

// PWA Installation
let deferredPrompt;

// Prüft, ob die App bereits installiert ist oder installiert werden kann
window.addEventListener('beforeinstallprompt', (e) => {
    // Verhindert, dass Chrome die Installation automatisch anzeigt
    e.preventDefault();
    // Speichert das Event, um es später auszulösen
    deferredPrompt = e;
    // Zeigt den Installations-Button an
    installButton.classList.remove('hidden');
});

// Wenn die App bereits installiert ist, wird das beforeinstallprompt-Event nicht ausgelöst
window.addEventListener('appinstalled', () => {
    // Die App wurde installiert
    console.log('PWA wurde installiert');
    // Versteckt den Installations-Button
    installButton.classList.add('hidden');
    deferredPrompt = null;
});

// Installations-Button Logik
installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
        // Die App kann nicht installiert werden (bereits installiert oder nicht unterstützt)
        return;
    }

    // Zeigt die Installations-Aufforderung an
    deferredPrompt.prompt();

    // Wartet auf die Entscheidung des Benutzers
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Benutzer-Entscheidung: ${outcome}`);

    // Wir können deferredPrompt nicht wiederverwenden
    deferredPrompt = null;

    // Versteckt den Installations-Button
    installButton.classList.add('hidden');
});

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    console.log('PWA wurde geladen');

    // Überprüft, ob die App als Standalone-App (installiert) läuft
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Die App läuft als Standalone-App (installiert)');
    }
});