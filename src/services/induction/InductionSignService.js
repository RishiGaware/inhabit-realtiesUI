import Api from "../Api";

export const getJobResponsibilityByUserId = async (userID) => {
  try {
    const response = await Api.get(
      `jobresponsibility/getjobresponsibilitybyuserid/${userID}`
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const signOffInductionAssignment = async (payload) => {
  try {
    if (
      !payload.userID ||
      !payload.induction_ID ||
      !payload.jobResponsibilityID ||
      !payload.plantID
    ) {
      throw new Error("Missing required fields in payload");
    }

    const formattedPayload = {
      userID: parseInt(payload.userID),
      induction_ID: parseInt(payload.induction_ID),
      jobResponsibilityID: parseInt(payload.jobResponsibilityID),
      plantID: parseInt(payload.plantID),
      createdBy: payload.createdBy,
      remarks: payload.remarks || "",
      electronicSignature: payload.electronicSignature,
      signatureDate: payload.signatureDate.split("T")[0], // Format date as YYYY-MM-DD
    };
    const response = await Api.post(
      "inductionassignment/signoff",
      formattedPayload
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};
