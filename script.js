const tasks = [
  { offset: -60, title: "J-60 : Prépare ton tri", details: "Commence à faire le tri dans tes affaires, vends ou donne ce que tu n’emporteras pas." },
  { offset: -30, title: "J-30 : Démarches administratives", details: "Préviens ton propriétaire, assure-toi que ton nouveau logement est prêt." },
  { offset: -15, title: "J-15 : Résilie tes abonnements", details: "Électricité, Internet, eau, gaz... transfère ou résilie les contrats." },
  { offset: -7, title: "J-7 : Prépare les cartons finaux", details: "Emballe les objets essentiels et prépare le nécessaire pour les premiers jours." },
  { offset: -1, title: "J-1 : Derniers préparatifs", details: "Débranche les appareils, nettoie et vérifie que tout est prêt pour le transport." },
  { offset: 0, title: "Jour J : C’est le grand jour !", details: "Supervise le chargement, fais l’état des lieux et prends les clés du nouveau logement." },
  { offset: 7, title: "J+7 : Installe-toi tranquillement", details: "Pense à signaler ton changement d’adresse à la Poste et mets à jour tes papiers." }
];
const button = document.getElementById('generate');
const list = document.getElementById('taskList');
button.addEventListener('click', () => {
  const dateInput = document.getElementById('moveDate').value;
  if (!dateInput) {
    alert("Merci de renseigner une date de déménagement !");
    return;
  }
  const moveDate = new Date(dateInput);
  list.innerHTML = "";
  tasks.forEach(task => {
    const taskDate = new Date(moveDate);
    taskDate.setDate(moveDate.getDate() + task.offset);
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${task.title}</strong>
      <span>${taskDate.toLocaleDateString('fr-FR')}</span><br>${task.details}
    `;
    list.appendChild(li);
  });
});
