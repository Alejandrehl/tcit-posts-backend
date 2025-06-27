import { ApiProperty } from '@nestjs/swagger';

export class ListPostsDto {
  @ApiProperty({
    description: 'Empty DTO for listing posts - no parameters required',
    example: {},
    type: Object,
  })
  readonly _empty: boolean = true;
}
