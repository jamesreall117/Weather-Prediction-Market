;; Historical Analysis Contract

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u401))
(define-constant ERR_NOT_FOUND (err u404))

;; Data Maps
(define-map user-accuracy
  { user: principal }
  {
    total-predictions: uint,
    correct-predictions: uint
  }
)

(define-map location-accuracy
  { location: (string-ascii 50) }
  {
    total-predictions: uint,
    correct-predictions: uint
  }
)

;; Functions
(define-public (record-prediction-result (user principal) (location (string-ascii 50)) (is-correct bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (update-user-accuracy user is-correct)
    (update-location-accuracy location is-correct)
    (ok true)
  )
)

(define-private (update-user-accuracy (user principal) (is-correct bool))
  (let
    ((current-accuracy (default-to { total-predictions: u0, correct-predictions: u0 } (map-get? user-accuracy { user: user }))))
    (map-set user-accuracy
      { user: user }
      {
        total-predictions: (+ (get total-predictions current-accuracy) u1),
        correct-predictions: (+ (get correct-predictions current-accuracy) (if is-correct u1 u0))
      }
    )
  )
)

(define-private (update-location-accuracy (location (string-ascii 50)) (is-correct bool))
  (let
    ((current-accuracy (default-to { total-predictions: u0, correct-predictions: u0 } (map-get? location-accuracy { location: location }))))
    (map-set location-accuracy
      { location: location }
      {
        total-predictions: (+ (get total-predictions current-accuracy) u1),
        correct-predictions: (+ (get correct-predictions current-accuracy) (if is-correct u1 u0))
      }
    )
  )
)

(define-read-only (get-user-accuracy (user principal))
  (let
    ((accuracy-data (default-to { total-predictions: u0, correct-predictions: u0 } (map-get? user-accuracy { user: user }))))
    (if (> (get total-predictions accuracy-data) u0)
      (ok (/ (* (get correct-predictions accuracy-data) u100) (get total-predictions accuracy-data)))
      (ok u0)
    )
  )
)

(define-read-only (get-location-accuracy (location (string-ascii 50)))
  (let
    ((accuracy-data (default-to { total-predictions: u0, correct-predictions: u0 } (map-get? location-accuracy { location: location }))))
    (if (> (get total-predictions accuracy-data) u0)
      (ok (/ (* (get correct-predictions accuracy-data) u100) (get total-predictions accuracy-data)))
      (ok u0)
    )
  )
)

