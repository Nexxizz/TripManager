# Trip Manager

Die Trip Manager App ist eine Anwendung zur Planung Ihrer Reisen. Sie können verschiedene Reiseziele hinzufügen, diese mit Aktivitäten und Fotos versehen und den Zeitraum Ihres Aufenthalts festlegen. Die App ist in zwei Hauptteile unterteilt: das Backend, das in TypeScript geschrieben und mit Mikro-ORM und Express.js betrieben wird, und das Frontend, das mit React und TypeScript erstellt wurde.

## Funktionalitäten

- **Reiseziele hinzufügen**: Nutzer können neue Reiseziele mit einer Beschreibung, geplanten Aktivitäten, Fotos und dem geplanten Aufenthaltszeitraum hinzufügen. Dies wird auf der Seite "Add a new Destination" durchgeführt.
- **Reiseziele anzeigen**: Nutzer können eine Liste aller hinzugefügten Reiseziele anzeigen. Dies wird auf der Startseite durchgeführt, wo alle vorhandenen Reiseziele aus der Datenbank abgerufen und angezeigt werden.
- **Reiseziele bearbeiten**: Nutzer können Details zu bestehenden Reisezielen bearbeiten. Dies wird auf der Startseite durchgeführt, wo Nutzer die Möglichkeit haben, die Informationen zu einem Reiseziel zu aktualisieren.
- **Reiseziele löschen**: Nutzer können Reiseziele aus ihrer Liste entfernen. Dies wird auf der Startseite durchgeführt, wo Nutzer die Möglichkeit haben, ein Reiseziel zu löschen.

- **Reisen hinzufügen**: Nutzer können neue Reisen mit einer Beschreibung, Teilnehmern, einem Bild und dem geplanten Aufenthaltszeitraum hinzufügen. Dies wird auf der Seite "Add a new Trip" durchgeführt.
- **Reisen anzeigen**: Nutzer können eine Liste aller hinzugefügten Reisen anzeigen. Dies wird auf der Startseite durchgeführt, wo alle vorhandenen Reisen aus der Datenbank abgerufen und angezeigt werden.
- **Reisen bearbeiten**: Nutzer können Details zu bestehenden Reisen bearbeiten. Dies wird auf der Startseite durchgeführt, wo Nutzer die Möglichkeit haben, die Informationen zu einer Reise zu aktualisieren.
- **Reisen löschen**: Nutzer können Reisen aus ihrer Liste entfernen. Dies wird auf der Startseite durchgeführt, wo Nutzer die Möglichkeit haben, eine Reise zu löschen.
- **Reiseziele zu einer Reise hinzufügen**: Nutzer können bestehende Reiseziele zu einer Reise hinzufügen. Dies wird auf der Startseite durchgeführt, wo Nutzer die Möglichkeit haben, bestehende Reiseziele zu einer Reise hinzuzufügen.
- **Reiseziele von einer Reise entfernen**: Nutzer können bereits vorhandene Reiseziele von einer Reise entfernen. Dies wird auf der Startseite durchgeführt, wo Nutzer die Möglichkeit haben, bereits vorhandene Reiseziele von einer Reise zu entfernen.

## Routenstruktur

- **Backend**:
  - `GET /destinations/GetAllDestinations`: Ruft eine Liste aller Reiseziele ab.
  - `POST /destinations/CreateDestination`: Erstellt ein neues Reiseziel.
  - `DELETE /destinations/DeleteDestination/:id`: Löscht ein bestimmtes Reiseziel.
  - `PUT /destinations/UpdateDestination/:id`: Aktualisiert ein bestimmtes Reiseziel.
  - `PUT /destinations/AddDestinationToTrip/:tripId/:destinationId`: Fügt ein Reiseziel zu einer bestimmten Reise hinzu.
  - `GET /destinations/GetDestinationByName/:name`: Ruft ein Reiseziel anhand seines Namens ab.
  - `PUT /destinations/LikeDestination/:id`: Freestyle Task 1. Fügt einem Reiseziel ein "Like" hinzu.
  - `GET /destinations/MostPopularDestinations`: Freestyle Task 1. Ruft eine Liste der beliebtesten Reiseziele ab.
  - `GET /destinations/WeatherForecast/:id`: Freestyle Task 2. Ruft die Wettervorhersage für ein bestimmtes Reiseziel ab.

  - `GET /trips/GetAllTrips`: Ruft eine Liste aller Reisen ab.
  - `POST /trips/CreateTrip`: Erstellt eine neue Reise.
  - `DELETE /trips/DeleteTrip/:id`: Löscht eine bestimmte Reise.
  - `PUT /trips/UpdateTrip/:id`: Aktualisiert eine bestimmte Reise.
  - `PUT /trips/AddMultipleDestinationsToTrip/:tripId`: Fügt mehrere Reiseziele zu einer bestimmten Reise hinzu.
  - `PUT /trips/RemoveMultipleDestinationsFromTrip/:tripId`: Entfernt mehrere Reiseziele von einer bestimmten Reise.
  - `GET /trips/GetTripsByDestination/:destinationName`: Ruft Reisen ab, die ein bestimmtes Reiseziel enthalten.
  - `GET /trips/SearchTrips`: Sucht nach Reisen basierend auf einem Suchbegriff.
  - `GET /trips/:id`: Ruft eine bestimmte Reise ab.
  - `GET /trips/GetTripByName/:name`: Ruft eine Reise anhand ihres Namens ab.
  - `GET /trips/GetTripDestinations/:tripId`: Ruft die Reiseziele einer bestimmten Reise ab.

- **Frontend**:
  - `/home`: Die Startseite, die eine Liste aller Reiseziele und Reisen anzeigt. Auf dieser Seite werden alle vorhandenen Reiseziele und Reisen aus der Datenbank abgerufen und angezeigt. Nutzer können hier die Details der Reiseziele und Reisen einsehen. Für jede Reise gibt es die Möglichkeit, bestehende Reiseziele hinzuzufügen (Add Destinations), bereits vorhandene Reiseziele zu entfernen (Remove Destinations), die Reiseinformationen zu aktualisieren (Update) und die Reise zu löschen (Delete). Für jedes Reiseziel gibt es die Möglichkeit, die Informationen zu aktualisieren (Update) und das Reiseziel zu löschen (Delete).
  - `/addTrip`: Die Seite zum Hinzufügen neuer Reisen. Als Add a new Trip auf der Seite bezeichnet.
  - `/addDestination`: Die Seite zum Hinzufügen neuer Reiseziele. Als Add a new Destination auf der Seite bezeichnet.




## Aufsetzen der Applikation

### Backend

.env Inhalt für die Datenbankverbindung (Mikro-ORM):
    DATABASE_URL=postgresql://benutzername:passwort@hostname:port/datenbankname

1. Navigieren Sie in das Backend-Verzeichnis: `cd backend`
2. Installieren Sie die notwendigen Abhängigkeiten: `npm install`
3. Starten Sie den Server: `npm run start:dev`
4. Datenbank erstellen oder aktualisieren: `npm run schema:fresh`

### Frontend

1. Navigieren Sie in das Frontend-Verzeichnis: `cd frontend`
2. Installieren Sie die notwendigen Abhängigkeiten: `npm install`
3. Starten Sie die App: `npm run dev`

Die Fotos werden per URL gesetzt. Hier ein paar Beispiel-URLs für die Fotos (Für Reisen wird ein Foto benötigt für Reiseziele werden 2 Fotos (mit Komma getrennt) auf der Seite angezeigt):

https://image.geo.de/30138026/t/pu/v3/w1440/r1/-/lenzen-geo-tag-der-natur-jpg--78476-.jpg

https://szm-media.sueddeutsche.de/image/szm/93cb43622718d7e1f45968742dd60ae7/640/image.jpeg

https://www.naturparke.de/fileadmin/_processed_/b/d/csm_Sonnenuntergang_ueber_dem_Simmelsberg_dsc02891web_c555c03163.jpg

Die 1 zu N beziehung das ein Reiseziel mindestens 1ne Reise haben kann habe ich in Frontend realisiert. 
Man wählt mindestens eine Reise, wenn man eine ein Reiseziel hinzufügt. Und man kann keine Reise löschen, das mit einem Reiseziel verknüpft ist, welche nur noch eine Reise hat.

## API-Tests

Um die API zu testen, können Sie ein Tool wie Postman verwenden. Siehe FWE24.postman_collection.json.
Um die Funktionalitäten bei dem die ID benötigt wird kann man mit Get ALL Destinations oder Get All Trips die ID herausfinden.
