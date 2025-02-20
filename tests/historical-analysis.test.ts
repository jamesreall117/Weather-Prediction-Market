import { describe, it, expect, beforeEach } from "vitest"

describe("Historical Analysis Contract", () => {
  let mockStorage: Map<string, any>
  
  beforeEach(() => {
    mockStorage = new Map()
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "record-prediction-result":
        const [user, location, isCorrect] = args
        if (sender !== "CONTRACT_OWNER") {
          return { success: false, error: "Not authorized" }
        }
        updateAccuracy(`user-${user}`, isCorrect)
        updateAccuracy(`location-${location}`, isCorrect)
        return { success: true }
      case "get-user-accuracy":
        const [getUser] = args
        return { success: true, value: calculateAccuracy(`user-${getUser}`) }
      case "get-location-accuracy":
        const [getLocation] = args
        return { success: true, value: calculateAccuracy(`location-${getLocation}`) }
      default:
        return { success: false, error: "Method not found" }
    }
  }
  
  const updateAccuracy = (key: string, isCorrect: boolean) => {
    const currentAccuracy = mockStorage.get(key) || { totalPredictions: 0, correctPredictions: 0 }
    mockStorage.set(key, {
      totalPredictions: currentAccuracy.totalPredictions + 1,
      correctPredictions: currentAccuracy.correctPredictions + (isCorrect ? 1 : 0),
    })
  }
  
  const calculateAccuracy = (key: string) => {
    const accuracy = mockStorage.get(key) || { totalPredictions: 0, correctPredictions: 0 }
    if (accuracy.totalPredictions === 0) {
      return 0
    }
    return Math.floor((accuracy.correctPredictions * 100) / accuracy.totalPredictions)
  }
  
  it("should record prediction result", () => {
    const result = mockContractCall("record-prediction-result", ["user1", "New York", true], "CONTRACT_OWNER")
    expect(result.success).toBe(true)
  })
  
  it("should not record prediction result if not contract owner", () => {
    const result = mockContractCall("record-prediction-result", ["user1", "New York", true], "user1")
    expect(result.success).toBe(false)
  })
  
  it("should get user accuracy", () => {
    mockContractCall("record-prediction-result", ["user1", "New York", true], "CONTRACT_OWNER")
    mockContractCall("record-prediction-result", ["user1", "London", false], "CONTRACT_OWNER")
    const result = mockContractCall("get-user-accuracy", ["user1"], "user1")
    expect(result.success).toBe(true)
    expect(result.value).toBe(50)
  })
  
  it("should get location accuracy", () => {
    mockContractCall("record-prediction-result", ["user1", "New York", true], "CONTRACT_OWNER")
    mockContractCall("record-prediction-result", ["user2", "New York", false], "CONTRACT_OWNER")
    mockContractCall("record-prediction-result", ["user3", "New York", true], "CONTRACT_OWNER")
    const result = mockContractCall("get-location-accuracy", ["New York"], "user1")
    expect(result.success).toBe(true)
    expect(result.value).toBe(66)
  })
  
  it("should return 0 accuracy for new user", () => {
    const result = mockContractCall("get-user-accuracy", ["newuser"], "newuser")
    expect(result.success).toBe(true)
    expect(result.value).toBe(0)
  })
  
  it("should return 0 accuracy for new location", () => {
    const result = mockContractCall("get-location-accuracy", ["New Location"], "user1")
    expect(result.success).toBe(true)
    expect(result.value).toBe(0)
  })
})

