import {IMessageDocument} from "./messages.types";
export async function setLastUpdated(this: IMessageDocument): Promise<void> {
    const now = new Date();
    if (!this.lastUpdated || this.lastUpdated < now) {
        this.lastUpdated = now;
        await this.save();
    }
}

