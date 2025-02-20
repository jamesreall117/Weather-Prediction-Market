import { describe, it, expect, beforeEach } from "vitest"

describe("Weather Data Contract", () => {
  let mockStorage: Map<string, any>
  
  beforeEach(() => {
    mockStorage = new Map()
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "add-weather-data":
        const [location, temperature, humidity, windSpeed, precipitation] = args
        if (!mockStorage.get(`oracle-${sender}`)) {
          return { success: false, error: "Not authorized" }
        }
        mockStorage.set(`weather-${location}-${100}`, { temperature, humidity, windSpeed, precipitation })
        return { success: true }
      case "authorize-oracle":
        const [oracle] = args
        if (sender !== "CONTRACT_OWNER") {
          return { success: false, error: "Not authorized" }
        }
        mockStorage.set(`oracle-${oracle}`, true)
        return { success: true }
      case "revoke-oracle":
        const [revokeOracle] = args
        if (sender !== "CONTRACT_OWNER") {
          return { success: false, error: "Not authorized" }
        }
        mockStorage.delete(`oracle-${revokeOracle}`)
        return { success: true }
      case "get-weather-data":
        const [getLocation, timestamp] = args
        return { success: true, value: mockStorage.get(`weather-${getLocation}-${timestamp}`) }
      case "is-authorized-oracle":
        const [checkOracle] = args
        return { success: true, value: !!mockStorage.get(`oracle-${checkOracle}`) }
      default:
        return { success: false, error: "Method not found" }
    }
  }
  
  it("should authorize an oracle", () => {
    const result = mockContractCall("authorize-oracle", ["oracle1"], "CONTRACT_OWNER")
    expect(result.success).toBe(true)
  })
  
  it("should not authorize an oracle if not contract owner", () => {
    const result = mockContractCall("authorize-oracle", ["oracle1"], "user1")
    expect(result.success).toBe(false)
  })
  
  it("should add weather data from authorized oracle", () => {
    mockContractCall("authorize-oracle", ["oracle1"], "CONTRACT_OWNER")
    const result = mockContractCall("add-weather-data", ["New York", 25, 60, 10, 0], "oracle1")
    expect(result.success).toBe(true)
  })
  
  it("should not add weather data from unauthorized oracle", () => {
    const result = mockContractCall("add-weather-data", ["New York", 25, 60, 10, 0], "oracle2")
    expect(result.success).toBe(false)
  })
  
  it("should get weather data", () => {
    mockContractCall("authorize-oracle", ["oracle1"], "CONTRACT_OWNER")
    mockContractCall("add-weather-data", ["New York", 25, 60, 10, 0], "oracle1")
    const result = mockContractCall("get-weather-data", ["New York", 100], "user1")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({ temperature: 25, humidity: 60, windSpeed: 10, precipitation: 0 })
  })
  
  it("should check if oracle is authorized", () => {
    mockContractCall("authorize-oracle", ["oracle1"], "CONTRACT_OWNER")
    const result = mockContractCall("is-authorized-oracle", ["oracle1"], "user1")
    expect(result.success).toBe(true)
    expect(result.value).toBe(true)
  })
  
  it("should revoke oracle authorization", () => {
    mockContractCall("authorize-oracle", ["oracle1"], "CONTRACT_OWNER")
    const result = mockContractCall("revoke-oracle", ["oracle1"], "CONTRACT_OWNER")
    expect(result.success).toBe(true)
    const checkResult = mockContractCall("is-authorized-oracle", ["oracle1"], "user1")
    expect(checkResult.value).toBe(false)
  })
})

