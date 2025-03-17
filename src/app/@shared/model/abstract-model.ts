/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 10/03/2025
 **/

export abstract class AbstractModel {
    protected toNumber(value: any): number | null {
        return value !== undefined && value !== null ? Number(value) : null;
    }

    protected toBoolean(value: any): boolean | null {
        return value !== undefined && value !== null ? Boolean(value) : null;
    }
}

