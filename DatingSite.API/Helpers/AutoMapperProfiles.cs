using System.Linq;
using AutoMapper;
using DatingSite.API.Dtos;
using DatingSite.API.Models;

namespace DatingSite.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // same name properties are mapped automatically
            // add configs to map custom properties

            CreateMap<User, UserForListDto>()
                // photo url
                .ForMember(dest => dest.PhotoUrl, opt =>
                    opt.MapFrom(src =>
                        src.Photos.FirstOrDefault(p => p.IsMain).Url))
                // age
                .ForMember(dest => dest.Age, opt =>
                    opt.MapFrom(src =>
                        src.DateOfBirth.CalculateAge()));

            CreateMap<User, UserForDetailedDto>()
                .ForMember(dest => dest.PhotoUrl, opt =>
                    opt.MapFrom(src =>
                        src.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.Age, opt =>
                    opt.MapFrom(src =>
                        src.DateOfBirth.CalculateAge()));

            CreateMap<Photo, PhotoForDetailedDto>();

            CreateMap<UserForUpdateDto, User>();

            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto, Photo>();

            CreateMap<UserForRegisterDto, User>();

            CreateMap<MessageForCreationDto, Message>();
            CreateMap<Message, MessageToReturnDto>()
                .ForMember(memberOptions => memberOptions.SenderPhotoUrl, opt => opt.MapFrom(u => u.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(memberOptions => memberOptions.RecipientPhotoUrl, opt => opt.MapFrom(u => u.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}