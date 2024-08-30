import { UTApi, UTFile } from "uploadthing/server";
const getConfig = ({ uTOptions }) => {
  const config = {
    ...uTOptions
  };
  return config;
};
const index = {
  init({ uTOptions }) {
    const config = getConfig({ uTOptions });
    const utapi = new UTApi(config);
    const upload = async (file) => {
      try {
        const utFile = new UTFile(
          [Buffer.from(file.buffer, "binary")],
          file.name
        );
        const utResponse = await utapi.uploadFiles(utFile);
        if (!utResponse || utResponse.error) {
          throw new Error(`Failed to upload image: ${utResponse?.error?.message || "Unknown error"}`);
        }
        if (!utResponse.data) {
          throw new Error("Failed to upload image: No data returned");
        }
        const imageUrl = utResponse.data.url;
        if (!imageUrl) {
          throw new Error("Failed to upload image: url not returned");
        }
        const key = utResponse.data.key;
        if (!key) {
          throw new Error("Failed to upload image: key not returned");
        }
        file.url = utResponse.data?.url;
        file.previewUrl = utResponse.data?.url;
        file.provider_metadata = {
          "fileKey": utResponse.data?.key,
          "customId": utResponse.data?.customId
        };
      } catch (error) {
        console.error("Error in uploading file:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        throw error;
      }
    };
    return {
      async upload(file) {
        return upload(file);
      },
      async delete(file) {
        try {
          const fileKey = file.provider_metadata?.fileKey;
          if (!fileKey) {
            throw new Error("Failed to upload image: key not returned");
          }
          return await utapi.deleteFiles(fileKey);
        } catch (error) {
          console.error("Error in deleting file:", error);
          if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
          }
          throw error;
        }
      },
      async isPrivate() {
        return false;
      },
      async getSignedUrl() {
      }
    };
  }
};
export {
  index as default
};
//# sourceMappingURL=index.mjs.map
