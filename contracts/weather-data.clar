;; Weather Data Contract

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u401))
(define-constant ERR_NOT_FOUND (err u404))

;; Data Maps
(define-map weather-data
  { location: (string-ascii 50), timestamp: uint }
  {
    temperature: int,
    humidity: uint,
    wind-speed: uint,
    precipitation: uint
  }
)

(define-map authorized-oracles
  { oracle: principal }
  { is-authorized: bool }
)

;; Functions
(define-public (add-weather-data (location (string-ascii 50)) (temperature int) (humidity uint) (wind-speed uint) (precipitation uint))
  (let
    ((oracle-auth (default-to { is-authorized: false } (map-get? authorized-oracles { oracle: tx-sender }))))
    (asserts! (get is-authorized oracle-auth) ERR_NOT_AUTHORIZED)
    (ok (map-set weather-data
      { location: location, timestamp: block-height }
      {
        temperature: temperature,
        humidity: humidity,
        wind-speed: wind-speed,
        precipitation: precipitation
      }
    ))
  )
)

(define-public (authorize-oracle (oracle principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ok (map-set authorized-oracles { oracle: oracle } { is-authorized: true }))
  )
)

(define-public (revoke-oracle (oracle principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ok (map-set authorized-oracles { oracle: oracle } { is-authorized: false }))
  )
)

(define-read-only (get-weather-data (location (string-ascii 50)) (timestamp uint))
  (map-get? weather-data { location: location, timestamp: timestamp })
)

(define-read-only (is-authorized-oracle (oracle principal))
  (default-to
    false
    (get is-authorized (map-get? authorized-oracles { oracle: oracle }))
  )
)

