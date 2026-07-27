export function toolError(reason: string) {
    return {
        success: false,
        error: {
            reason
        }
    };
}